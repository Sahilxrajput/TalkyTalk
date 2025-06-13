import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

const ChatWindow = ({
  foundChats,
  socketMessages,
  videoReqHandler,
  aboutHandler,
  getChatData,
  setSocketMessages,
  msgId,
  setMsgId,
  replyRef,
  user,
  showPopup,
  setShowPopup,
  setReplyPopup,
  chatTitle,
}) => {
  const messagesEndRef = useRef(null);
  const [savedMessages, setSavedMessages] = useState([]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [msgToReply, setMsgToReply] = useState("");
  const [msgToReply2, setMsgToReply2] = useState("");
  const majorRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [matchedChat, setMatchedChat] = useState();

  const getAllMessages = async (chatId) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/message`,
      { chatId: chatId },
      { withCredentials: true }
    );
    return response.data.data;
  };

  const otherMember = chatTitle.members.find(
    (member) => member._id !== user.user._id
  );

  const ContextMenuhandler = (e, msg) => {
    e.preventDefault();
    setPos({ x: e.pageX, y: e.pageY });
    setShowPopup(true);
    setMsgId(msg._id);
    setMsgToReply(msg.content || msg.message);
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
      console.log(msgToReply);
      setTimeout(() => {
        setCopied(false);
        setShowPopup(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    const matchedChat = foundChats.find((chat) => chat._id === chatTitle._id);
    setMatchedChat(matchedChat);
  }, [chatTitle, foundChats]);

  useEffect(() => {
    (async function () {
      const chatAllMessages = await getAllMessages(chatTitle._id);
      setSavedMessages(chatAllMessages);
      setSocketMessages([]); // reset on chat change
    })();
  }, [chatTitle._id, savedMessages, socketMessages]);

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

  return (
    <div className="flex  justify-center items-center">
      <nav className="flex justify-between ml-4 bg-red-400 pl-4 h-1/10 border-b-2 items-center w-full ">
        <div className="flex gap-4">
          <div className="w-14 rounded-full aspect-square">
            <img
              className="object-cover rounded-full w-full h-full"
              src={getChatData()?.image?.url || user.user.image.url}
              alt="profil"
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">
              {getChatData().username || matchedChat?.chatName}
            </h1>
            <h4>
              {matchedChat?.members?.length} members, &nbsp; {} online
            </h4>
          </div>
        </div>
        <div className="flex justify-end gap-6 items-center w-1/10 text-2xl">
          <i className="ri-find-replace-line"></i>
          <i onClick={videoReqHandler} className="ri-video-on-fill"></i>
          <i onClick={videoReqHandler} className="ri-phone-fill"></i>
          <i onClick={aboutHandler} className="ri-menu-3-line"></i>
        </div>
      </nav>

      <main
        ref={majorRef}
        className="p-2 overflow-x-hidden flex flex-col  h-8/10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div>
          {savedMessages.map((msg, index) => {
            const isMine = msg.sender._id === user.user._id;
            const isReplied = msg?.replyTo?._id || false;
            const date = new Date(msg.updatedAt);
            const timePart = date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            return (
              <div
                key={index}
                className={`flex items-end justify-end gap-2 ${
                  isMine ? "flex-row" : "flex-row-reverse"
                } mb-2 w-full`}
              >
                <div
                  onContextMenu={(e) => ContextMenuhandler(e, msg)}
                  onClick={clickhandler}
                  className={`flex justify-end gap-2 min-w-28 items-end p-t-1 px-1 max-w-[450px] rounded-[10px] ${
                    isMine ? "bg-[#0b93f6]" : "bg-[#E57A44]"
                  }`}
                  ref={
                    index === savedMessages.length - 1 ? messagesEndRef : null
                  }
                >
                  <div className="text-lg flex flex-col w-full">
                    {chatTitle.members.length > 2 && (
                      <h6 className="text-xs font-semibold">
                        @{msg.sender.username}
                      </h6>
                    )}
                    {isReplied && (
                      <div className="bg-gray-500 border-l-4 rounded-sm border-green-700 break-words overflow-ellipsis whitespace-nowrap overflow-hidden">
                        {msg.replyTo.content}
                      </div>
                    )}
                    <div className="flex flex-col break-words whitespace-pre-wrap overflow-hidden w-full">
                      <h4 className="text-white break-words px-1 whitespace-pre-wrap">
                        {msg.content}
                      </h4>
                      <div className="text-gray-200 text-xs flex items-center justify-end">
                        {timePart}
                        &nbsp;
                        <i className="text-lg ri-check-double-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-8 rounded-full aspect-square">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={msg?.sender?.image?.url}
                    alt=""
                  />
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
                className="flex text-white popupOptions bg-green-500 items-center py-1 px-3 gap-4 rounded-[5px]"
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
        <div>
          {socketMessages.map((msg, index) => {
            const isMine = msg.sender._id == user.user._id;
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
                className={`flex items-end justify-end gap-2 ${
                  isMine ? " flex-row " : "flex-row-reverse "
                } mb-2 w-full`}
              >
                <div
                  onContextMenu={(e) => ContextMenuhandler(e, msg)}
                  onClick={clickhandler}
                  className={`flex justify-end gap-2 min-w-28 items-end px-1 p-t-1 max-w-[450px] rounded-[10px] ${
                    isMine ? "bg-[#0b93f6]" : "bg-[#E57A44]"
                  }`}
                  ref={
                    index === savedMessages.length - 1 ? messagesEndRef : null
                  }
                >
                  <div
                    className={"text-lg flex flex-col w-full"}
                    ref={
                      index === socketMessages.length - 1
                        ? messagesEndRef
                        : null
                    }
                  >
                    {chatTitle.members.length > 2 && (
                      <h6 className="text-xs  font-semibold">
                        {" "}
                        @{msg.sender.username}{" "}
                      </h6>
                    )}
                    {isReplied && (
                      <div className="bg-gray-500 border-l-4 rounded-sm border-green-700 break-words overflow-ellipsis whitespace-nowrap overflow-hidden">
                        {msgToReply2}{" "}
                      </div>
                    )}
                    <div className="flex flex-col break-words whitespace-pre-wrap overflow-hidden w-full">
                      <h4 className="text-white break-words whitespace-pre-wrap">
                        {msg.message}
                      </h4>
                      <div className="text-gray-200 text-xs flex items-center justify-end">
                        {timePart}
                        &nbsp;
                        <i className="text-lg ri-check-double-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-8 rounded-full aspect-square ">
                  <img
                    className="w-full h-full  rounded-full object-cover"
                    src={msg?.sender?.image?.url}
                    alt=""
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ..replyPopUp */}
      <div
        ref={replyRef}
        className={
          " flex absolute bottom-6 w-[35%] bg-[#DAD1BE] h-12 rounded-lg p-2 justify-between items-center"
        }
      >
        <i className="ri-reply-fill text-xl "></i>
        <div className="flex flex-col w-[85%]  break-words whitespace-normal overflow-hidden items-start">
          <h1 className="text-[#0b93f6] font-semibold">
            Reply to {chatTitle.chatName}
          </h1>
          <h3>{msgToReply}</h3>
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
    </div>
  );
};

export default ChatWindow;
