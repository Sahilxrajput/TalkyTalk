import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "./Loading";
import ChatCard from "./ChatCard";

const CreategroupPanel = ({ setCreateGroupPanel, user, setFoundChats }) => {
  const [searchUser, setSearchUser] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [addMembers, setAddMembers] = useState([]);
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);

  useEffect(() => {
    async function getAllUsers() {
      try {
        setMainLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users`,
          { withCredentials: true }
        );

        const responseArray = data.users || [];

        const otherUsers = responseArray.filter((mem) => mem._id !== user?._id);
        setFoundUsers(otherUsers);
      } catch (error) {
        console.log(error);
      } finally {
        setMainLoading(false);
      }
    }
    getAllUsers();
    return () => {
      setFoundUsers([]);
    };
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setMainLoading(true);
        if (searchUser.trim() === "") {
          setFilteredUsers(foundUsers);
          return;
        }
        const filtered = foundUsers.filter((u) =>
          `${u.firstName} ${u.lastName} ${u.username}`
            .toLowerCase()
            .includes(searchUser.toLowerCase())
        );

        setFilteredUsers(filtered);
      } catch (error) {
        console.error("Error in filtering users:", error);
      } finally {
        setMainLoading(false);
      }
    };
    fetchUsers();
    return () => {
      setFilteredUsers([]);
    };
  }, [searchUser, foundUsers]);

  const selectUsersHandler = (userId) => {
    setSelectedUsers((prevSelectedUserIds) => {
      // Check if user is already selected
      if (!prevSelectedUserIds.includes(userId)) {
        // Add user to selected list
        return [...prevSelectedUserIds, userId];
      } else {
        // Remove user from selected list (unselect)
        return prevSelectedUserIds.filter((id) => id !== userId);
      }
    });

    setAddMembers((prev) => {
      if (!prev.includes(userId)) {
        return [...prev, userId];
      } else {
        return prev.filter((id) => id !== user._id);
      }
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const formData = new FormData();
      formData.append("chatName", chatName);
      formData.append("image", file);
      addMembers.forEach((memberId) => formData.append("memberIds[]", memberId));
      console.log("formdata : ", formData);
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/group`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("group data : ", data);

      const newChat = data.chat;

      setChatName("");
      setAddMembers([]);
      setFoundUsers([]);
      setFilteredUsers([]);
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
    <div className="flex flex-col fixed w-full  h-full overflow-x-hidden  justify-start gap-4 rounded-4xl bg-[#EEE5E5] border-[#37392e]">
      <form
        onSubmit={submitHandler}
        className="flex flex-col absolute w-full z-20 h-[27%] text-[#19647e]  items-center justify-start gap-4 rounded-4xl"
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
        <div className="border-2 w-[80%]  border-[#19647e]  flex items-center justify-start  gap-2 px-3 py-1 rounded-lg">
          <i className="ri-folder-add-fill text-2xl "></i>
          <input
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder="Chat Name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        </div>

        <div className="border-2 w-[80%] border-[#19647e] flex items-center justify-start  gap-2 px-3 py-1 rounded-lg">
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
            className=" bg-[#19647e] hover:cursor-pointer flex items-center justify-center font-semibold text-white py-2 w-20 rounded-lg "
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
          filteredUsers.map((user, idx) => {
            const isSelected = selectedUsers.includes(user._id); // Check if user is selected
            return (
              <ChatCard
                onSelect={(param) => selectUsersHandler(param)}
                isSelected={isSelected}
                idx={idx}
                user={user}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CreategroupPanel;
