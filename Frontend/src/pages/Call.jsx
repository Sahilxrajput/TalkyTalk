import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL);
  
const Call = () => {
  const localVideo = useRef();
  const remoteVideo = useRef();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [pc, setPc] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    const getMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localVideo.current.srcObject = stream;
    };

    getMedia();

    socket.emit("register", user.user); // Replace with dynamic ID

    socket.on("incoming-call", async ({ from, offer }) => {
      setIncomingCall({ from, offer });
    });

    socket.on("call-accepted", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("call-rejected", () => {
      alert("Call rejected");
    });

    socket.on("receive-candidate", async ({ candidate }) => {
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }, [pc]);

  const createPeerConnection = (remoteSocketId) => {
    const peer = new RTCPeerConnection();
    localStream.getTracks().forEach(track => peer.addTrack(track, localStream));

    peer.ontrack = (e) => {
      setRemoteStream(e.streams[0]);
      remoteVideo.current.srcObject = e.streams[0];
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("send-candidate", { to: remoteSocketId, candidate: e.candidate });
      }
    };

    setPc(peer);
    return peer;
  };

  const callUser = async (remoteSocketId) => {
    const peer = createPeerConnection(remoteSocketId);

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("call-user", { to: remoteSocketId, offer });
  };

  const acceptCall = async () => {
    const peer = createPeerConnection(incomingCall.from);

    await peer.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer-call", { to: incomingCall.from, answer });
    setIncomingCall(null);
  };

  const rejectCall = () => {
    socket.emit("reject-call", { to: incomingCall.from });
    setIncomingCall(null);
  };

  const toggleMute = () => {
    localStream.getAudioTracks()[0].enabled = isMuted;
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStream.getVideoTracks()[0].enabled = !videoEnabled;
    setVideoEnabled(!videoEnabled);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">TalkyTalk Video Call</h2>

      <div className="flex gap-6">
        <video ref={localVideo} autoPlay muted playsInline className="w-1/2 border" />
        <video ref={remoteVideo} autoPlay playsInline className="w-1/2 border" />
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={() => callUser("user2")} className="bg-blue-500 px-4 py-2 text-white rounded">Call User2</button>
        <button onClick={toggleMute} className="bg-gray-500 px-4 py-2 text-white rounded">{isMuted ? "Unmute" : "Mute"}</button>
        <button onClick={toggleVideo} className="bg-gray-700 px-4 py-2 text-white rounded">{videoEnabled ? "Hide Video" : "Show Video"}</button>
      </div>

      {incomingCall && (
        <div className="mt-4 bg-yellow-200 p-4 rounded">
          <p>Incoming Call</p>
          <button onClick={acceptCall} className="bg-green-500 px-3 py-1 text-white rounded mr-2">Accept</button>
          <button onClick={rejectCall} className="bg-red-500 px-3 py-1 text-white rounded">Reject</button>
        </div>
      )}
    </div>
  );
};

export default Call;
