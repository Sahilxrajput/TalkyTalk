import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ChatWindow from "./ChatWindow";
import { data } from "react-router-dom";
import CryptoJS from "crypto-js";
// import socket from '../socket/Socket'

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

const MessageBox = ({
  user,
  foundChats,
  aboutHandler,
  videoReqHandler,
  getChatData,
  setFoundChats,
  chatTitle,
  replyRef,
  setShowPopup,
  showPopup,
  replyPopup,
  setReplyPopup,
}) => {
  const [socketMessages, setSocketMessages] = useState([]);
  const [latestMessage, setLatestMessage] = useState("");
  const latestMessageRef = useRef(null);
  const [msgId, setMsgId] = useState(0);

  const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(
      message,
      import.meta.env.VITE_SECRET_KEY
    ).toString();
  };

  const decryptMessage = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(
      ciphertext,
      import.meta.env.VITE_SECRET_KEY
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const encrypted = encryptMessage(latestMessage);
    if (latestMessage.trim()) {
      const messageData = {
        roomId: chatTitle._id,
        message: encrypted,
        sender: user.user,
      };
      if (replyPopup && msgId) {
        messageData.replyTo = msgId; // assuming msgId is the ID you're replying to
      }

      socket.emit("chat", messageData);
      console.log("messageData", messageData);
      setLatestMessage("");
      setReplyPopup(false);
    }
  };

  // //join -> rooms
  useEffect(() => {
    (async function () {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/chat`,
        { withCredentials: true }
      );
      const responseArray = response.data;
      const chatIds = responseArray.map((response) => response._id);
      const roomIds = chatIds || [];
      socket.emit("joinRoom", roomIds); // Join the new group room
    })();
  }, []);

  // receive a message
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    const handleChat = (payload) => {
      if (chatTitle._id === payload.roomId) {
        const decrypted = decryptMessage(payload.message);
        console.log("decrypted", decrypted);
        setSocketMessages((prevMessages) => [...prevMessages, decrypted]);
      }
    };
    console.log(decrypted);
    socket.on("chat", handleChat);

    return () => {
      socket.off("chat", handleChat);
      socket.off("connect");
    };
  }, [chatTitle]);
  //finding socketid == senderid
  // const msgSenderUser = (payload) => {
  //   return chatTitle.members.find((member) => member._id === payload.sender);
  // };

  return (
    <>
      <ChatWindow
        foundChats={foundChats}
        videoReqHandler={videoReqHandler}
        aboutHandler={aboutHandler}
        getChatData={getChatData}
        user={user}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        replyRef={replyRef}
        msgId={msgId}
        setMsgId={setMsgId}
        setReplyPopup={setReplyPopup}
        setSocketMessages={setSocketMessages}
        socketMessages={socketMessages}
        chatTitle={chatTitle}
      />
      <div className="flex flex-col items-center">
        <form
          onSubmit={sendMessageHandler}
          className={`
            ${replyPopup ? "rounded-t-none" : "rounded-t-lg"}
            absolute w-[35%] bg-[#DAD1BE] h-14 z-20 flex items-center justify-start gap-2 px-2 py-2 rounded-lg`}
        >
          <input
            name="message"
            className="appearance-none text-lg border-none w-[95%] bg-transparent px-2 m-0 focus:outline-none"
            type="text"
            placeholder="Your message"
            value={latestMessage}
            onChange={(e) => setLatestMessage(e.target.value)}
          />
          <button ref={latestMessageRef} type="submit">
            <i className="text-2xl  ri-send-plane-fill"></i>
          </button>
        </form>
      </div>
      <button className="h-12 aspect-square rounded-full text-2xl bg-red-400">
        <i className="ri-mic-fill"></i>
      </button>
    </>
  );
};

export default MessageBox;
