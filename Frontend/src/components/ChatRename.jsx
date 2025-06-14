import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { toast } from "react-toastify";

const ChatRename = ({ setChatRenamePanel, chatTitle }) => {
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
        setUpdatedName(false);
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
      onSubmit={(e) => submitHandler(e)}
      className="flex justify-start items-center w-full gap-4 rounded-xl  bg-[#DAD1BE] h-12"
    >
      <input
        type="text"
        placeholder="Group name should be minimum 3 letter long"
        className=" rounded-xl px-4 w-8/10 text-xl font-bold h-full"
        onChange={(e) => setUpdatedName(e.target.value)}
        name="updatedChatName"
      />
      <button
        type="submit"
        disabled={updatedName == ''}
        className={`border-[#457b9d]  bg-[#e63946] text-[#DAD1BE] p-1 rounded-lg font-semibold ${updatedName == '' ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        Rename
      </button>
      <i
        type="button"
        onClick={() => {
          setChatRenamePanel(false);
          setUpdatedName("");
        }}
        className="ri-add-fill rotate-45 bg-[#457b9d] text-[#DAD1BE] cursor-pointer aspect-square h-8 rounded-full flex justify-center items-center font text-3xl font-bold"
      ></i>
    </form>
  );
};

export default ChatRename;
