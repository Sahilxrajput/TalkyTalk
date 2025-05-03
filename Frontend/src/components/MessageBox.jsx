import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import ChatShowArea from "../components/ChatShowArea";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

const MessageBox = () => {
  const [latestMessage, setLatestMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const latestMessageRef = useRef(null);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (latestMessage.trim()) {
      socket.emit("chat", latestMessage);
      // socket.emit("groupChat", latestMessage); // Emit the new group chat to the server
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/message/send`,
        { content: latestMessage, chatId: "6815605571a2dea2fe28685a" },
        { withCredentials: true }
      );
      console.log(response.data);
      setLatestMessage("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("User connected!", socket.id);
    });
    socket.on("chat", (payload) => {
      setMessages((prevMessages) => [...prevMessages, payload]);
    });
    return () => {
      socket.off("chat");
      socket.off("connect");
    };
  });

  return (
    <>
      <ChatShowArea messages={messages} />
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
