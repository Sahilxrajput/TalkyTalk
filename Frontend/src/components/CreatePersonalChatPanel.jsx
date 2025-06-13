import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const CreatePersonalChatPanel = ({
  setSearchNewMembelPanel,
  user,
  setFoundChats,
}) => {
  const [searchUser, setSearchUser] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addFriend, setAddFriend] = useState("");

  useEffect(() => {
    if (searchUser.trim() !== "") {
      (async () => {
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
        }
      })();
    }
    return () => {
      setFoundUsers([]);
    };
  }, [searchUser]);

  const submitHandler = async (user) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/personal`,
        { chatName: user.username, members: [user._id] },
        { withCredentials: true }
      );
      const newChat = response.data.chat;
      console.log("Personal Chat Created:", response.data);
      toast.success("Personal chat Created Successfully");
      setSearchNewMembelPanel(false);
      setAddFriend("");
      setFoundChats((prev) => [...prev, newChat]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const selectedUserHandler = (userId) => {
    setSelectedUserId((prevId) => (prevId === userId ? null : userId));
  };

  return (
    <>
      <div className="flex w-full flex-col justify-center p-2">
        <div className="fixed flex flex-col items-center rounded-4xl w-full bg-red-400 z-50 h-[15%] left-0 top-0">
          <i
            onClick={() => {
              setSearchNewMembelPanel(false);
              setSearchUser("");
              setSelectedUserId(null);
            }}
            className="text-2xl hover:cursor-pointer  text-gray-700 font-semibold ri-arrow-down-wide-fill"
          ></i>
          <div className="border-2 border-red-500 w-9/10 bg-gray-400 flex items-center justify-between gap-2 px-3 p-2 rounded-lg">
            <i className="ri-find-replace-line"></i>
            <input
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="appearance-none border-none w-full bg-transparent p-0 m-0 focus:outline-none"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <div
        className="flex h-full w-full mt-12 overflow-x-hidden flex-col gap-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {foundUsers.map((user, idx) => {
          const isSelected = selectedUserId === user._id;

          return (
            <div
              onClick={() => selectedUserHandler(user._id)}
              key={idx}
              className={` h-16 py-2 w-full px-2 hover:cursor-pointer flex justify-between items-center rounded-2xl ${
                isSelected ? "bg-red-500 " : "bg-yellow-400"
              }`}
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
                <button
                  type="submit"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddFriend(user._id);
                    submitHandler(user);
                  }}
                  className="bg-blue-700 flex justify-between hover:cursor-pointer  text-sm items-center p-2 rounded-lg"
                >
                  Chat<i class="ri-sparkling-fill"></i>
                </button>
              ) : (
                <i className="ri-user-add-fill"></i>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CreatePersonalChatPanel;
