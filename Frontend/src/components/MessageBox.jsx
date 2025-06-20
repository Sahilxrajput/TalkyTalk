import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import ChatWindow from "./ChatWindow";

const socket = io(import.meta.env.VITE_BASE_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const MessageBox = ({
  setSocketMessages,
  socketMessages,
  user,
  setSavedMessages,
  savedMessages,
  ViewChatDetailsPanel,
  setViewChatDetailsPanel,
  foundChats,
  aboutHandler,
  videoReqHandler,
  getChatData,
  setFoundChats,
  chatTitle,
  replyRef,
  replyPopup,
  setReplyPopup,
}) => {
  const [latestMessage, setLatestMessage] = useState("");
  const latestMessageRef = useRef(null);
  const [msgId, setMsgId] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (latestMessage.trim()) {
      const messageData = {
        roomId: chatTitle._id,
        message: latestMessage,
        sender: user.user,
      };
      if (replyPopup && msgId) {
        messageData.replyTo = msgId;
      }

      socket.emit("chat", messageData);
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
      // console.log("Connected to socket:", socket.id);
    });

    const handleChat = (payload) => {
      if (chatTitle._id === payload.roomId) {
        setSocketMessages((prevMessages) => [...prevMessages, payload]);
      }
    };
    socket.on("chat", handleChat);

    socket.on("connect_error", (err) => {
      socket.io.on("error", (err) => {
        console.error("💥 io error:", err);
      });

      socket.on("error", (err) => {
        console.error("💥 socket error:", err);
      });
    });

    return () => {
      socket.off("chat", handleChat);
      socket.off("connect");
    };
  }, [chatTitle]);

  return (
    <main className="overflow-y-auto h-full px-1 w-full">
      <ChatWindow
        setSavedMessages={setSavedMessages}
        savedMessages={savedMessages}
        ViewChatDetailsPanel={ViewChatDetailsPanel}
        setViewChatDetailsPanel={setViewChatDetailsPanel}
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
            absolute bottom-6 w-4/10 bg-[#DAD1BE] h-14 align-middle z-20 flex items-center justify-start gap-2 p-2 rounded-lg`}
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
            <i className="text-2xl  ri-send-plane-fill cursor-pointer"></i>
          </button>
        </form>
      </div>
    </main>
  );
};

export default MessageBox;
