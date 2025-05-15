import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../context/UserContext";

const ChatShowArea = ({ socketMessages, setSocketMessages, chatTitle }) => {
  const { user } = useContext(UserDataContext);

  const messagesEndRef = useRef(null);
  const [savedMessages, setSavedMessages] = useState([]);

  const getAllMessages = async (chatId) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/message`,
      { chatId: chatId },
      { withCredentials: true }
    );
    return response.data.data;
  };

  useEffect(() => {
    (async function () {
      const realChatId = chatTitle.chatId;
      const chatAllMessages = await getAllMessages(realChatId);
      setSavedMessages(chatAllMessages);
      setSocketMessages([]);
    })();
  }, [chatTitle.chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [socketMessages]);

  return (
    <div
      className="p-2 overflow-x-hidden flex flex-col  h-8/10"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div
        className="flex flex-col items-end"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {savedMessages.map((msg, index) => {
          const isMine = msg.sender._id === user.user._id;
          const date = new Date(msg.updatedAt);
          const timePart = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return (
            <div
              key={index}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              } mb-2 w-full`}
            >
              <div
                className={` flex justify-end gap-2 items-end  p-2  ${
                  isMine ? "bg-[#0b93f6]" : "bg-pink-500 "
                } max-w-[450px] rounded-[10px] `}
                ref={index === savedMessages.length - 1 ? messagesEndRef : null}
              >
                <div className=" text-white text-lg break-words whitespace-pre-wrap overflow-hidden">
                  {msg.content}
                </div>
                <div className=" text-gray-800 text-xs block h-[20px] ">
                  {timePart}
                  &nbsp;
                  <i className=" text-lg ri-check-double-line"></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className=" flex flex-col items-end"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {socketMessages.map((msg, index) => {
          const isMine = msg.sender == user.user._id;
          const date = new Date(msg.time);
          const timePart = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return (
            <div
              key={index}
              className={`flex ${
                isMine ? "justify-end " : "justify-start"
              } mb-2 w-full`}
            >
              <div
                className={` flex justify-end gap-2 items-end p-2  ${
                  isMine ? "bg-[#0b93f6]" : "bg-pink-500 "
                } max-w-[450px] rounded-[10px]`}
                ref={index === savedMessages.length - 1 ? messagesEndRef : null}
              >
                <div
                  className={" text-white break-words whitespace-pre-wrap overflow-hidden text-lg "}
                  ref={
                    index === socketMessages.length - 1 ? messagesEndRef : null
                  }
                >
                  {msg.message}
                </div>

                <div className=" text-gray-800 text-xs h-[20px]">
                  {timePart}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatShowArea;
