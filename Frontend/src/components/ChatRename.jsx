import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from './Loading'

const ChatRename = ({ setChatRenamePanel, chatTitle }) => {
  const [updatedName, setUpdatedName] = useState("");
  const [isLaoding, setIsLaoding] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLaoding(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/chat/grouprename`,
        { updatedChatName: updatedName, chatId: chatTitle._id },
        { withCredentials: true }
      );
      if (response.status == 200) {
        setChatRenamePanel(false);
        setUpdatedName("");
        toast.success("Chat rename successfully");
      }
      if (response.status == 403) {
        toast.warning("Only admin can rename chat");
      }
    } catch (error) {
      // console.log(error);
      toast.error("Somthing goes wrong");
    } finally {
      setIsLaoding(false);
    }
  };

  return (
    <form
      onSubmit={(e) => submitHandler(e)}
      className="flex justify-start items-center w-full gap-4 rounded-xl px-4 bg-[#DAD1BE] h-12"
    >
      <input
        type="text"
        placeholder="Group name should be minimum 3 letter long"
        className=" rounded-xl  w-8/10 text-xl font-bold h-full focus:outline-0 "
        onChange={(e) => setUpdatedName(e.target.value)}
        name="updatedChatName"
      />
      <button
        type="submit"
        disabled={updatedName == "" || isLaoding}
        className={`border-[#457b9d]  bg-[#e63946] text-[#DAD1BE] h-8 w-24 rounded-lg font-semibold ${
          updatedName == "" ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {isLaoding ? <Loading /> : "Rename"}
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
