import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../context/UserContext";

const ChatWindow = ({
  socketMessages,
  setSocketMessages,
  msgId,
  setMsgId,
  showPopup,
  setShowPopup,
  replyRef,
  setReplyPopup,
  chatTitle,
}) => {
  const { user } = useContext(UserDataContext);

  const messagesEndRef = useRef(null);
  const [savedMessages, setSavedMessages] = useState([]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [msgToReply, setMsgToReply] = useState("");
  const [msgToReply2, setMsgToReply2] = useState("");
  const majorRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const getAllMessages = async (chatId) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/message`,
      { chatId: chatId },
      { withCredentials: true }
    );
    return response.data.data;
  };

  const ContextMenuhandler = (e, msg) => {
    e.preventDefault();
    setPos({ x: e.pageX, y: e.pageY });
    setShowPopup(true);
    setMsgId(msg._id);
    setMsgToReply(msg.content);
  };

  const deleteMessage = async () => {
    try {
      setSavedMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      setSocketMessages((prev) => prev.filter((msg) => msg._id !== msgId));

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/message/delete`,
        { messageId: msgId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const clickhandler = () => {
    setShowPopup(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msgToReply);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowPopup(false);
      }, 1500); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    console.log(msgToReply);
  }, [msgToReply]);

  useEffect(() => {
  (async function () {
    const chatAllMessages = await getAllMessages(chatTitle.chatId);
    setSavedMessages(chatAllMessages);
    setSocketMessages([]); // reset on chat change
  })();
}, [chatTitle.chatId]);

// useEffect(() => {
//   if (socketMessages.length > 0) {
//     setSavedMessages((prev) => [...prev, ...socketMessages]);
//     setSocketMessages([]); // clear once merged
//   }
// }, [socketMessages]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [socketMessages]);

  useEffect(() => {
    if (majorRef.current) {
      if (showPopup) {
        majorRef.current.classList.add("overflow-hidden");
      } else {
        majorRef.current.classList.remove("overflow-hidden");
      }
    }
  }, [showPopup]);

  // useEffect(() => {
  //   socketMessages.map((msg, index) => {
  //     console.log("====================================");
  //     console.log(msg);
  //     console.log("====================================");
  //   });
  // }, [socketMessages]);

  // useEffect(() => {
  //   savedMessages.map((msg, index) => {
  //     console.log("`````````````````````````````");
  //     console.log(msg);
  //     console.log("`````````````````````````````");
  //   });
  // }, [savedMessages]);
  return (
    <>
      <div
        ref={majorRef}
        className="p-2 overflow-x-hidden flex flex-col  h-8/10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div
        // className="flex flex-col items-end"
        // style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {savedMessages.map((msg, index) => {
            const isMine = msg.sender._id === user.user._id;
            const isReplied = msg?.replyTo || false;
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
                  onContextMenu={(e) => ContextMenuhandler(e, msg)}
                  onClick={clickhandler}
                  className={` flex justify-end gap-2 items-end  p-2  ${
                    isMine ? "bg-[#0b93f6]" : "bg-[#f47230] "
                  }
                 ${isReplied ? "border-2" : ""} 
                  max-w-[450px] rounded-[10px] `}
                  ref={
                    index === savedMessages.length - 1 ? messagesEndRef : null
                  }
                >
                  <div className="text-text text-lg break-words whitespace-pre-wrap overflow-hidden">
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
          {showPopup && (
            <div
              style={{ top: pos.y, left: pos.x }}
              className="absolute bg-[#1f1f1fca] justify-between flex flex-col h-27 w-40 rounded-xl py-1.5 px-1 z-50"
            >
              <div
                onClick={() => {
                  setMsgToReply2(msgToReply);
                  setReplyPopup(true);
                  setShowPopup(false);
                }}
                className="flex text-white popupOptions items-center py-1 px-3 gap-4 rounded-[5px]"
              >
                <i className="ri-reply-line"></i>
                <p>Reply</p>
              </div>
              <div
                onClick={() => {
                  handleCopy();
                }}
                className="flex text-white popupOptions items-center py-1  px-3 gap-4 rounded-[5px] "
              >
                <i className="ri-file-copy-line"></i>
                <p> {copied ? "Copied!" : "Copy"} </p>
              </div>
              <div
                onClick={() => {
                  deleteMessage();
                  setShowPopup(false);
                }}
                className="flex text-red-600 popupOptions items-center py-1  px-3 gap-4 rounded-[5px]"
              >
                <i className="ri-delete-bin-6-line"></i>
                <p>Delete</p>
              </div>
            </div>
          )}
        </div>
        <div
        // className=" flex flex-col items-end"
        // style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {socketMessages.map((msg, index) => {
            const isMine = msg.sender == user.user._id;
            const date = new Date(msg.time);
            const isReplied = msg.replyTo?._id || false;
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
                  onContextMenu={(e) => ContextMenuhandler(e, msg)}
                  onClick={clickhandler}
                  className={` flex justify-end gap-2 items-end p-2  ${
                    isMine ? "bg-[#0b93f6]" : "bg-[#E57A44] "
                  }
                  ${isReplied ? "border-2" : ""}    
                  max-w-[450px] rounded-[10px]`}
                  ref={
                    index === savedMessages.length - 1 ? messagesEndRef : null
                  }
                >
                  <div
                    className={
                      "break-words whitespace-pre-wrap overflow-hidden text-lg "
                    }
                    ref={
                      index === socketMessages.length - 1
                        ? messagesEndRef
                        : null
                    }
                  >
                    {msg.message}
                  </div>

                  <div className=" text-gray-800 text-xs h-[20px]">
                    {timePart}
                    &nbsp;
                    <i className=" text-lg ri-check-double-line"></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        ref={replyRef}
        className={` flex absolute w-[35%] ml-[265px] bg-[#DAD1BE]  h-12 mt-1 rounded-t-lg p-2 justify-between items-center`}
      >
        <i className="ri-reply-fill text-xl "></i>
        <div className="flex flex-col w-[85%] break-words whitespace-normal overflow-hidden items-start">
          <h1 className="text-[#0b93f6] font-semibold">
            Reply to {chatTitle.chatName}
          </h1>
          <h3>{msgToReply2}</h3>
        </div>
        <i
          onClick={() => {
            setMsgToReply("");
            setMsgToReply2("");
            setReplyPopup(false);
          }}
          className="ri-add-line text-2xl rotate-45 "
        ></i>
      </div>
    </>
  );
};

export default ChatWindow;
