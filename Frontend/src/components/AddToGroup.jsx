import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "remixicon/fonts/remixicon.css";
import Loading from "./Loading";

const AddTOGroup = ({ setAddToGroupPanel, chatTitle }) => {
  const [searchUser, setSearchUser] = useState("");
  const [availableUser, setAvailableUser] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchUser.trim() !== "") {
      (async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/users`,
            { withCredentials: true }
          );
          const allUsers = response.data.users;
          const chatMembers = chatTitle.members.map((mem) => mem._id);

          const otherUsers = allUsers.filter(
            (user) => !chatMembers.includes(user._id)
          );

          const filtered = otherUsers.filter((user) =>
            `${user.firstName} ${user.lastName} ${user.username}`
              .toLowerCase()
              .includes(searchUser.toLowerCase())
          );

          setAvailableUser(filtered); //  update state correctly
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      })();
    } else {
      setAvailableUser([]);
    }
  }, [searchUser]);

  const selectedUsersHandler = (user) => {
    setSelectedUsers((prevSelected) => {
      if (!prevSelected.includes(user._id)) {
        return [...prevSelected, user._id];
      } else {
        return prevSelected.filter((id) => id !== user._id);
      }
    });
  };

  const submitHandler = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/chat/groupadd`,
        { userIds: selectedUsers, chatId: chatTitle._id },
        { withCredentials: true }
      );
      if (response.status == 200) {
        setAddToGroupPanel(false);
        toast.success("member add succesfully");
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-6 justify-start gap-6 items-center">
      <div className="flex w-full  flex-col items-center justify-center">
        <i
          onClick={() => setAddToGroupPanel(false)}
          className="text-2xl py-2 cursor-pointer text-gray-700 font-semibold ri-arrow-down-wide-fill"
        ></i>
        <div className="w-full flex flex-col items-end justify-center gap-2">
          <div className="border-2 w-full bg-gray-400 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-1 rounded-lg">
            <i className="ri-user-add-fill text-2xl text-[#D30C7B]"></i>
            <input
              className="appearance-none border-none w-full bg-transparent p-0 m-0 focus:outline-none"
              type="text"
              value={searchUser}
              onChange={(e) => {
                setSearchUser(e.target.value);
              }}
              placeholder="Add Members"
            />
          </div>
          <button
            disabled={isLoading || selectedUsers.length == 0}
            onClick={() => submitHandler()}
            className={`py-2 w-1/4 text-white bg-blue-600 rounded-lg ${
              selectedUsers.length == 0 || isLoading
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isLoading ? <Loading /> : "Add"}
          </button>
        </div>
      </div>
      <div className="flex items-center flex-col w-full gap-4">
        {availableUser.length === 0 ? (
          <div className="text-red-700 font-semibold italic mt-6">
            &#9734; &nbsp; No Such User Exist
          </div>
        ) : (
          availableUser.map((user, idx) => {
            const isSelected = selectedUsers.includes(user._id); // Check if user is selected
            return (
              <div
                onClick={() => selectedUsersHandler(user)}
                key={idx}
                className={`${
                  isSelected ? "bg-red-500" : "bg-green-500"
                } border-2 h-16 py-2 cursor-pointer w-full flex justify-between items-center px-2 rounded-2xl`}
              >
                <div className="h-full items-center justify-between w-full flex ">
                  <div className="h-full items-center flex-wrap flex gap-4">
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
                      <h4 className="italic text-gray-700 ">
                        @{user.username}
                      </h4>
                    </div>
                  </div>
                  {isSelected ? (
                    <i className="text-xl ri-close-circle-fill"></i>
                  ) : (
                    <i className="text-xl ri-add-circle-fill"></i>
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

export default AddTOGroup;
