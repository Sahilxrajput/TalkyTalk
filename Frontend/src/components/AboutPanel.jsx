import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
const AboutPanel = ({
  setSocketMessages,
  setSavedMessages,
  setAddToGroupPanel,
  setAboutPanel,
  user,
  setIsGrpAdmin,
  isGrpAdmin,
  setViewChatDetailsPanel,
  chatTitle,
  foundChats,
  setFoundChats,
  setChatRenamePanel,
}) => {
  const [isLoading, setIsLoading] = useState({
    exit: false,
    delete: false,
    block: false,
    clear: false,
  });

  const BlockHandler = async () => {
    const otherMember = chatTitle.members.find(
      (member) => member._id !== user.user._id
    );
    setIsLoading((prev) => ({
      ...prev,
      block: true,
    }));
    if (chatTitle.members.length === 2 && otherMember) {
      try {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/users/block`,
          {
            blockerId: user.user._id,
            blockedId: otherMember._id,
          },
          { withCredentials: true }
        );
        setFoundChats((prev) =>
          prev.filter((chat) => chat._id !== chatTitle._id)
        );
        toast.success("User blocked successfully");
      } catch (error) {
        console.error("Failed to block user:", error);
      } finally {
        setIsLoading((prev) => ({
          ...prev,
          block: false,
        }));
        setAboutPanel(false);
      }
    } else {
      console.warn("Block action only applies to one-on-one chats.");
    }
  };

  const deleteChatHandler = async () => {
    setIsLoading((prev) => ({
      ...prev,
      delete: true,
    }));
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/chat/delete/${chatTitle._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status == 200) {
        toast.success("Group deleted successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(
        "Error removing user from group:",
        error.response?.data || error.message
      );
    } finally {
      setAboutPanel(false);
      setIsLoading((prev) => ({
        ...prev,
        delete: false,
      }));
    }
  };

  const exitChatHandler = async () => {
    setIsLoading((prev) => ({
      ...prev,
      exit: true,
    }));
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/chat/groupremove`,
        { userIds: user.user._id, chatId: chatTitle._id },
        { withCredentials: true }
      );
      if (response.status == 200) {
        toast.success("Exit chat succesfully");
      }
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        exit: false,
      }));
      setAboutPanel(false);
    }
  };

  const clearChat = async () => {
    setIsLoading((prev) => ({
      ...prev,
      clear: true,
    }));

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/chat/clear-chat/${chatTitle._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.status == 200) {
        toast.success("delete all messages successfully");
        setSavedMessages([]);
        setSocketMessages([]);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        clear: false,
      }));
      setAboutPanel(false);
    }
  };

  return (
    <div className="flex flex-col justify-start p-2 pt-0 gap-1 items-center">
      <i
        onClick={() => {
          setAboutPanel(false);
        }}
        className="text-2xl cursor-pointer text-center text-gray-700 font-semibold ri-arrow-down-wide-fill"
      ></i>
      <button
        onClick={() => {
          setViewChatDetailsPanel(true);
          setAboutPanel(false);
          setChatRenamePanel(false);
          setAddToGroupPanel(false);
        }}
        className="cursor-pointer hover:bg-blue-800 text-[#457b9d] hover:text-white transition-colors duration-300 ease-in flex justify-center gap-2 items-center border-1 py-2 w-full rounded-xl"
      >
        <i className="ri-user-smile-line"></i>View
      </button>
      {(!chatTitle.isGroupChat || isGrpAdmin) && (
        <button
          onClick={clearChat}
          className={`cursor-pointer hover:bg-gray-500 transition-colors hover:text-white duration-300 ease-in flex justify-center gap-2 items-center text-[#457b9d] border-1 py-2 w-full rounded-xl ${
            isLoading.clear && "bg-gray-500"
          }`}
        >
          {isLoading.clear ? (
            <Loading />
          ) : (
            <>
              {" "}
              <i className="ri-delete-bin-6-line"></i>Clear Chat
            </>
          )}
        </button>
      )}
      {chatTitle.isGroupChat && isGrpAdmin && (
        <>
          {" "}
          <button
            onClick={() => {
              setChatRenamePanel(true);
              setAboutPanel(false);
              setAddToGroupPanel(false);
              setViewChatDetailsPanel(false);
            }}
            className="hover:bg-gray-500 transition-colors duration-300 ease-in hover:text-white cursor-pointer flex justify-center gap-2 items-center text-[#457b9d] border-1 py-2 w-full text-lg rounded-xl"
          >
            <i className="ri-pencil-fill"></i> Rename
          </button>
          <button
            onClick={() => {
              setAddToGroupPanel(true);
              setChatRenamePanel(false);
              setViewChatDetailsPanel(false);
              setAboutPanel(false);
            }}
            className="hover:bg-gray-500 transition-colors duration-300 ease-in hover:text-white flex cursor-pointer justify-center gap-2 items-center text-[#457b9d] border-1 p-2 w-full text-lg rounded-xl"
          >
            <i className="ri-user-add-line"></i>Add
          </button>
          <button
            onClick={deleteChatHandler}
            className={`hover:bg-red-600 transition-colors duration-300 ease-in hover:text-white flex justify-center cursor-pointer gap-2 items-center text-[#457b9d] border-1 p-2 w-full text-lg rounded-xl ${
              isLoading.delete && "bg-red-600"
            }`}
          >
            {isLoading.delete ? (
              <Loading />
            ) : (
              <>
                {" "}
                <i className="ri-door-open-line"></i>Delete{" "}
              </>
            )}
          </button>
        </>
      )}

      {chatTitle.isGroupChat && !isGrpAdmin && (
        <button
          onClick={exitChatHandler}
          className={`hover:bg-red-600 transition-colors duration-300 ease-in hover:text-white flex justify-center cursor-pointer gap-2 items-center text-[#457b9d] border-1 py-2 w-full text-lg rounded-xl ${
            isLoading.exit && "bg-red-600"
          }`}
        >
          {isLoading.exit ? (
            <Loading />
          ) : (
            <>
              {" "}
              <i className="ri-door-open-line"></i>Exit Group{" "}
            </>
          )}
        </button>
      )}

      {!chatTitle.isGroupChat && (
        <button
          onClick={BlockHandler}
          className="hover:bg-red-600 transition-colors duration-300 ease-in hover:text-white flex justify-center cursor-pointer text-[#457b9d] gap-2 items-center  border-1 p-2 w-full text-lg rounded-xl"
        >
          {isLoading.block ? (
            <Loading />
          ) : (
            <>
              {" "}
              <i className="ri-spam-line font-black"></i>Block{" "}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AboutPanel;
