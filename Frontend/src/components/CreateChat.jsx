import React from "react";
import "remixicon/fonts/remixicon.css";

const AddMembers = ({
  setCreatePersonalChatPanel,
  setCreateGroupPanel,
  setcreateChat,
}) => {
  return (
    <div className=" flex flex-col p-4 h-full">
      <i
        onClick={() => {
          setcreateChat(false);
        }}
        className="text-2xl text-center text-gray-700 font-semibold ri-arrow-down-wide-fill hover:cursor-pointer"
      ></i>
      <div className="flex gap-12 mt-6 items-center pb-10 justify-center">
        <button
          type="button"
          onClick={() => {
            setCreateGroupPanel(true);
            setcreateChat(false);
          }}
          className="flex flex-col hover:cursor-pointer "
        >
          <div className="bg-blue-500 aspect-square  text-white text-3xl flex items-center justify-center rounded-full h-[50px]">
            <i className="ri-team-line"></i>
          </div>
          <h4>Create Group</h4>
        </button>
        <button
          onClick={() => {
            setCreatePersonalChatPanel(true);
            setcreateChat(false);
          }}
          type="button"
          className="flex flex-col hover:cursor-pointer "
        >
          <div className="bg-blue-500 aspect-square  text-white text-3xl flex items-center justify-center rounded-full h-[50px]">
            <i className="ri-user-add-line"></i>
          </div>
          <h4>Add Friends</h4>
        </button>
      </div>
    </div>
  );
};

export default AddMembers;
