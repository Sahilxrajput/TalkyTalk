import React from "react";

const ChatHeader = () => {
  return (
    <div className="flex justify-between bg-red-400 pl-4 h-1/10 border-b-2 items-center w-full ">
      <div>
        <h1 className="text-3xl font-semibold">{chatTitle.chatName}</h1>
        <h4>
          {chatTitle.members} members, &nbsp; {onlineUsers} online
        </h4>
      </div>
      <div className="flex justify-end gap-6 items-center w-1/10 text-2xl">
        <i className="ri-find-replace-line"></i>
        <i onClick={videoReqHandler} className="ri-video-on-fill"></i>
        <i onClick={videoReqHandler} className="ri-phone-fill"></i>
        <i onClick={aboutHandler} className="ri-menu-3-line"></i>
      </div>
    </div>
  );
};

export default ChatHeader;
