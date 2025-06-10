import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoComponent = () => {
  var socketRef = useRef();
  let socketIdRef = useRef();
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  const localVideoRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [newMessage, setNewMessage] = useState(0);
  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("HELLO!");
    getPermission();
  });

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", video, audio);
    }
  }, [video, audio]);

  const getPermission = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video permission granted");
      } else {
        setVideoAvailable(false);
        console.log("Video permission denied");
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio permission granted");
      } else {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(() => {
          getUserMediaSuccess;
        })
        .then((stream) => {})
        .then(console.log("connected!"))
        .catch((e) => console.log(e));
    } else {
      try {
      } catch (error) {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        console.log(error);
      }
    }
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketIdRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideo((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = newRTCPeerConnection(
            peerConfigConnections
          );

          connections[socketListId].onicecandidate = (event) => {
            //ice => intractive connectivity estabilsment
            if (event.candidate != null) {
              socketRef.connect.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: eventNames.candidate })
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExist = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExist) {
              setVideo((video) => {
                const updatedVideos = video.map((video) =>
                  video.socketId !== socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsInline: false,
              };
              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addstream(window.localStream);
          } else {
            //TODO BalckSilence
          }
        });
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ 'sdp': connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  const getMedia = () => {
    setAudio(audioAvailable);
    setVideo(videoAvailable);
    connectToSocketServer();
  };

  const getUserMediaSuccess = (stream) => {};

  const gotMessageFromServer = (fromId, message) => {};

  const addMessage = () => {};

  return (
    <div>
      VideoComponent
      <div className="flex justify-around items-center ">
        <video className="h-52 w-52" ref={localVideoRef} autoPlay muted></video>
        <button
          className="bg-blue-600 h-12 w-18 rounded-lg"
          onClick={() => getUserMedia()}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default VideoComponent;
