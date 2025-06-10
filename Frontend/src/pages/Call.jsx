import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

const Call = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
      });

    socket.on("offer", async (offer) => {
      peerRef.current = createPeer(false);
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      console.log(offer);
      
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
    );
    });

    socket.on("candidate", async (candidate) => {
      if (peerRef.current) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }, []);

  const createPeer = (isInitiator) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("candidate", e.candidate);
      }
    };

    peer.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    localStreamRef.current
      .getTracks()
      .forEach((track) => peer.addTrack(track, localStreamRef.current));

    return peer;
  };

  const startCall = async () => {
    peerRef.current = createPeer(true);
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    socket.emit("offer", offer);
    setCallStarted(true);
  };

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-2xl font-bold mb-4">WebRTC Video Call</h1>
      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-64 border rounded-lg"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-64 border rounded-lg"
        />
      </div>
      {!callStarted && (
        <button
          onClick={startCall}
          className="bg-green-600 text-white px-4 py-2 mt-4 rounded-lg"
        >
          Start Call
        </button>
      )}
    </div>
  );
};

export default Call;
