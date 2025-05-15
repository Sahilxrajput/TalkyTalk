import React, { useEffect, useRef, useContext, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import ChatShowArea from "../components/ChatShowArea";
import { data } from "react-router-dom";
// import socket from '../socket/Socket'
import { UserDataContext } from "../context/UserContext";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

const MessageBox = ({ chatTitle }) => {
  // const [savedMessages, setSavedMessages] = useState([]);
  const [socketMessages, setSocketMessages] = useState([]);
  const [latestMessage, setLatestMessage] = useState("");
  const latestMessageRef = useRef(null);

  const { user } = useContext(UserDataContext);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (latestMessage.trim()) {
      socket.emit("chat", {
        roomId: chatTitle.chatId,
        message: latestMessage,
        sender: user.user._id,
      });
      setLatestMessage("");
    }
  };

  // //join -> room
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

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    const handleChat = (payload) => {
      if (chatTitle.chatId === payload.roomId)
        setSocketMessages((prevMessages) => [...prevMessages, payload]);
    };
    socket.on("chat", handleChat);

    return () => {
      socket.off("chat", handleChat);
      socket.off("connect");
    };
  }, [chatTitle]);

  return (
    <>
      <ChatShowArea
        setSocketMessages={setSocketMessages}
        socketMessages={socketMessages}
        chatTitle={chatTitle}
      />
      <form
        onSubmit={sendMessageHandler}
        className=" w-[90%] mt-4  bg-[#DAD1BE] flex items-center justify-start  gap-2 px-2 py-2 rounded-lg"
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
    </>
  );
};

export default MessageBox;
