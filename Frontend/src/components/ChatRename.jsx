import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { toast } from "react-toastify";

const ChatRename = ({ chatRenameRef, setChatRenamePanel, chatTitle }) => {
  const [updatedName, setUpdatedName] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setUpdatedName("");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/chat/grouprename`,
        { updatedChatName: updatedName, chatId: chatTitle._id },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status == 200) {
        setChatRenamePanel(false);
        toast.success("Chat rename successfully");
      }
      if (response.status == 403) {
        toast.warning("Only admin can rename chat");
      }
    } catch (error) {
      console.log(error);
      toast.error("Somthing goes wrong");
    }
  };

  return (
    <form
      ref={chatRenameRef}
      onSubmit={(e) => submitHandler(e)}
      className="flex justify-start items-center w-full gap-8 px-4 bg-gray-600 h-12"
    >
      <i className="ri-pencil-fill text-2xl"></i>
      <input
        type="text"
        placeholder="group name should be minimum 3 letter long"
        className="bg-yellow-500 w-8/10 text-xl font-bold h-full"
        onChange={(e) => setUpdatedName(e.target.value)}
        name="updatedChatName"
      />
      <button type="submit" className="bg-blue-600 p-1 rounded-lg">
        Rename
      </button>
      <i
      type="submit"
        onClick={() => setChatRenamePanel(false)}
        className="ri-add-fill rotate-45 font text-3xl font-bold"
      ></i>
    </form>
  );
};

export default ChatRename;
