import React from "react";

const ChatHeader = () => {
  return (
    <div className="flex justify-between ml-4 bg-red-400 pl-4 h-1/10 border-b-2 items-center w-full ">
        <div className="flex gap-4">
          <div className="w-14 rounded-full aspect-square">
            <img
              className="object-cover rounded-full w-full h-full"
              src={user.user.image.url}
              alt="profil"
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">
              {getChatData().username || getChatData().chatName}
            </h1>
            <h4>
              {chatTitle.members.length} members, &nbsp; {} online
            </h4>
          </div>
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
