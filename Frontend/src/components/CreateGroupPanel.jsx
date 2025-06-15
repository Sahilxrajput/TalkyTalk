import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loading from "./Loading";
import tax from "../assets/pic/tex.jpg";


const CreategroupPanel = ({ setCreateGroupPanel, user, setFoundChats }) => {
  const [searchUser, setSearchUser] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [addMembers, setAddMembers] = useState([]);
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);

  useEffect(() => {
    if (searchUser.trim() !== "") {
      (async () => {
        setMainLoading(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/users`,
            { withCredentials: true }
          );

          const responseArray = response.data.users;
          const otherUsers = responseArray.filter(
            (mem) => mem._id !== user.user._id
          );

          const filtered = otherUsers.filter((user) =>
            `${user.firstName} ${user.lastName} ${user.username}`
              .toLowerCase()
              .includes(searchUser.toLowerCase())
          );

          setFoundUsers(filtered);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setMainLoading(false);
        }
      })();
    }

    return () => {
      setFoundUsers([]);
      setMainLoading(false);
    };
  }, [searchUser]);

  const selectUsersHandler = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      // Check if user is already selected
      if (!prevSelectedUsers.includes(user._id)) {
        // Add user to selected list
        return [...prevSelectedUsers, user._id];
      } else {
        // Remove user from selected list (unselect)
        return prevSelectedUsers.filter((id) => id !== user._id);
      }
    });

    setAddMembers((prev) => {
      if (!prev.includes(user._id)) {
        return [...prev, user._id];
      } else {
        return prev.filter((id) => id !== user._id); // Return unchanged array
      }
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const formData = new FormData();
      console.log(file);
      formData.append("chatName", chatName);
      formData.append("image", file);
      addMembers.forEach((memberId) => formData.append("members[]", memberId));

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/group`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newChat = response.data.chat;
      console.log(newChat);
      setChatName(""); // Reset chat name
      setAddMembers([]); // Reset added members
      setFile(null);
      toast.success("New Group Created Successfully");
      setCreateGroupPanel(false);
      setFoundChats((prev) => [...prev, newChat]);
    } catch (error) {
      toast.error(" Something went wrong");
      console.error("Error creating group:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div
      className="flex flex-col fixed w-full  h-full overflow-x-hidden  justify-start gap-4 rounded-4xl"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
       <div className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage: `url(${tax})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 1,
              }}
            ></div>
      <form
        onSubmit={submitHandler}
        className="flex flex-col absolute w-full z-20 h-[27%] text-[#DAD1BE]  items-center justify-start gap-4 rounded-4xl"
      >
        <i
          onClick={() => {
            setCreateGroupPanel(false);
            setChatName("");
            setSearchUser("");
            setSelectedUsers([]);
            setAddMembers([]);
          }}
          className="text-2xl -mb-4 hover:cursor-pointer text-center font-semibold  ri-arrow-down-wide-fill"
        ></i>
        <div className="border-2 w-[80%]  border-[#DAD1BE]  flex items-center justify-start  gap-2 px-3 py-1 rounded-lg">
          <i className="ri-folder-add-fill text-2xl"></i>
          <input
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder="Chat Name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        </div>

        <div className="border-2 w-[80%] border-[#DAD1BE] flex items-center justify-start  gap-2 px-3 py-1 rounded-lg">
          <i className="ri-user-add-fill text-2xl "></i>
          <input
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            value={searchUser}
            onChange={(e) => {
              setSearchUser(e.target.value);
            }}
            placeholder="Add Members"
          />
        </div>
        <div className="flex w-full items-center justify-around">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-1/2 border-2 rounded-lg"
          />
          {imagePreview && <img src={imagePreview} alt="Preview" width="30" />}
          <button
            type="submit"
            className=" bg-[#1d3557] hover:cursor-pointer flex items-center justify-center font-semibold text-white py-2 w-20 rounded-lg "
          >
            {btnLoading ? (
              <div>
                <Loading />
              </div>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>

      <div className="flex mt-48 mx-6 h-full flex-col gap-4">
        {mainLoading ? (
          <Loading />
        ) : (
          foundUsers.map((user, idx) => {
            const isSelected = selectedUsers.includes(user._id); // Check if user is selected
            return (
              <div>
                <div
                  onClick={() => {
                    selectUsersHandler(user);
                  }}
                  key={idx}
                  className={`${
                    isSelected ? "bg-red-500" : "bg-green-600"
                  } border-2 h-16 py-2 cursor-pointer w-full flex justify-between items-center px-2 rounded-2xl`}
                >
                  <div className="h-full w-full flex gap-4">
                    <div className="h-full rounded-full aspect-square">
                      <img
                        className="object-cover rounded-full w-full h-full"
                        src={user.image.url}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col items-start ">
                      <div className="flex justify-start items-center gap-2">
                        <h2>
                          {user.firstName} {user.lastName}
                        </h2>
                      </div>
                      <h4>{user.username}</h4>
                    </div>
                  </div>
                  {isSelected ? (
                    <i className="text-xl text-[#1d3557] ri-close-circle-fill"></i>
                  ) : (
                    <i className="text-xl text-[#1d3557] ri-add-circle-fill"></i>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CreategroupPanel;
