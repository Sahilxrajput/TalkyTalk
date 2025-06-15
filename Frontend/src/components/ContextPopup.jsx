import React from "react";

const ContextPopup = () => {
  return (
    <div
      style={{ top: `${pos.y}px`, left: `${pos.x}px` }}
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
        className="flex text-white popupOptions items-center py-1 px-3 gap-4 rounded-[5px] "
      >
        <i className="ri-file-copy-line"></i>
        <p> {copied ? "Copied!" : "Copy"} </p>
      </div>
      <div
        onClick={() => {
          deleteMessage();
          setShowPopup(false);
        }}
        className="flex text-red-600 popupOptions items-center py-1 px-3 gap-4 rounded-[5px]"
      >
        <i className="ri-delete-bin-6-line"></i>
        <p>Delete</p>
      </div>
    </div>
  );
};

export default ContextPopup;
