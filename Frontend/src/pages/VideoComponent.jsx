import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

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

  useEffect(() => {
    getPermission();
  });

  const getUserMediaSuccess = (stream) => {

  }

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(() => {getUserMediaSuccess})
        .then((stream) => {})
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

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, {secure: false})
    
  }

  const getMedia = () => {
    setAudio(audioAvailable);
    setVideo(videoAvailable);
    connectToSocketServer()
  };

  return (
    <div>
      VideoComponent
      <div>
        <video className="h-52 w-52" ref={localVideoRef} autoPlay muted></video>
      </div>
    </div>
  );
};

export default VideoComponent;
