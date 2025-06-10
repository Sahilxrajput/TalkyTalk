import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { toast } from "react-toastify";

const AboutPanel = ({
  setAddToGroupPanel,
  setAboutPanel,
  user,
  setRemoveFromGroupPanel,
  chatTitle,
  foundChats,
  setFoundChats,
  setChatRenamePanel,
}) => {
  const [isGroupChat, setIsGroupChat] = useState(false);

  useEffect(() => {
    const totalMembers = chatTitle.members;
    if (totalMembers?.length != 2) {
      setIsGroupChat(true);
    } else {
      setIsGroupChat(false);
    }
  }, [chatTitle]);

  const BlockHandler = async () => {
    const otherMember = chatTitle.members.find(
      (member) => member._id !== user.user._id
    );

    // Check if it's a one-on-one chat
    if (chatTitle.members.length === 2 && otherMember) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/users/block`,
          {
            blockerId: user.user._id,
            blockedId: otherMember._id,
          },
          { withCredentials: true }
        );

        toast.success("User blocked successfully");
      } catch (error) {
        console.error("Failed to block user:", error);
      }
    } else {
      console.warn("Block action only applies to one-on-one chats.");
    }
  };

  const removeChatHandler = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/chat/groupremove`,
        {
          userId: user.user._id,
          chatId: chatTitle._id,
        },
        { withCredentials: true }
      );
      const remainingChat = foundChats.filter((c) => c._id !== chatTitle._id);
      setFoundChats(remainingChat);
      setAboutPanel(false);
    } catch (error) {
      console.error(
        "Error removing user from group:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex flex-col justify-between px-4 pb-2 gap-2 items-center ">
      <i
        onClick={() => {
          setAboutPanel(false);
        }}
        className="text-2xl -mb-4 text-center text-gray-700 font-semibold  ri-arrow-down-wide-fill"
      ></i>
      <button className="bg-blue-800 flex justify-center gap-2 items-center text-white border-1 p-2 w-full rounded-xl">
        <i className="ri-user-smile-line"></i>View
      </button>
      <button className="bg-gray-500 flex justify-center gap-2 items-center text-white border-1 p-2 w-full rounded-xl">
        <i className="ri-delete-bin-6-line"></i>Clear Chat
      </button>
      {chatTitle.groupAdmin === user?.user?._id && (
        <>
          {" "}
          <button
            onClick={() => {
              setChatRenamePanel(true);
              setAboutPanel(false);
              setAddToGroupPanel(false)
              setRemoveFromGroupPanel(false)
            }}
            className="bg-gray-500 flex justify-center gap-2 items-center text-white border-1 p-2 w-full text-lg rounded-xl"
          >
            <i className="ri-pencil-fill"></i> Rename Chat
          </button>
          <button
            onClick={()=>{setAddToGroupPanel(true)
              setChatRenamePanel(false)
              setRemoveFromGroupPanel(false)
              setAboutPanel(false)
            }}
          className="bg-gray-500 flex justify-center gap-2 items-center text-white border-1 p-2 w-full text-lg rounded-xl">
           <i className="ri-user-add-line"></i> Add Member
          </button>
          <button 
          onClick={()=>{setRemoveFromGroupPanel(true)
            setAboutPanel(false)
            setChatRenamePanel(false)
            setAddToGroupPanel(false)
          }}
          className="bg-gray-500 flex justify-center gap-2 items-center text-white border-1 p-2 w-full text-lg rounded-xl">
            <i className="ri-close-circle-line"></i>Remove Member
          </button>
        </>
      )}
      {!isGroupChat ? (
        <button
          onClick={BlockHandler}
          className="bg-red-600 flex justify-center text-white gap-2 items-center  border-1 p-2 w-full text-lg rounded-xl"
        >
          <i className="ri-spam-line font-black"></i>Block
        </button>
      ) : (
        <button
          onClick={removeChatHandler}
          className="bg-red-600 flex justify-center gap-2 items-center text-white border-1 p-2 w-full text-lg rounded-xl"
        >
          <i className="ri-door-open-line"></i>Exit Chat
        </button>
      )}
    </div>
  );
};

export default AboutPanel;
