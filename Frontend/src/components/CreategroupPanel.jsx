import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

const CreategroupPanel = (props) => {
  const [searchUser, setSearchUser] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [addMembers, setAddMembers] = useState([]);
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messages, setMessages] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users`,
          { withCredentials: true }
        );
        const responseArray = response.data.users;

        const filtered = responseArray.filter((user) =>
          `${user.firstName} ${user.lastName} ${user.username}`
            .toLowerCase()
            .includes(searchUser.toLowerCase())
        );

        setFoundUsers(filtered); //  update state correctly
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (searchUser.trim() !== "") {
      fetchUsers(); //  call the async function
    } else {
    }

    return () => {
      // Cleanup logic if needed
    };
  }, [searchUser]);

  const addMembersHandler = async (user) => {
    setAddMembers((prev) => {
      if (!prev.includes(user._id)) {
        return [...prev, user._id];
      } else {
        console.log("User already added.");
        return prev; // Return unchanged array
      }
    });
  };

  const selectedUsersHandler = (user) => {
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
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/group`,
        { chatName, members: addMembers },
        { withCredentials: true }
      );
      socket.emit("joinRoom", response.data._id); // Join the new group room
      //socket.emit("groupChat", response.data); // Emit the new group chat to the server

      //socket.emit("newGroup", response.data); // Emit the new group event to the server
      setChatName(""); // Reset chat name
      setAddMembers([]); // Reset added members
      console.log("Group created:", response.data);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("User connected!", socket.id);
    });
    socket.on("chat", (payload) => {
      setMessages((prevMessages) => [...prevMessages, payload]);
    });
    return () => {
      socket.off("chat");
      socket.off("connect");
    };
  });

  //   useEffect(() => {
  //     console.log("Updated members:", addMembers);
  //   }, [addMembers]);

  return (
    <div
      className="flex flex-col fixed w-full  h-full overflow-x-hidden  justify-start gap-4  bg-red-300 rounded-4xl"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <form
        onSubmit={submitHandler}
        className="flex flex-col absolute w-full z-20 h-[27%]  items-center  justify-start gap-4  bg-red-300 rounded-4xl"
      >
        <i
          onClick={() => {
            props.setCreateGroupPanel(false);
            console.log(props);
          }}
          className="text-2xl -mb-4 text-center text-gray-700 font-semibold  ri-arrow-down-wide-fill"
        ></i>
        <div className="border-2 w-[80%] bg-gray-400 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-1 rounded-lg">
          <i className="ri-folder-add-fill text-2xl text-[#D30C7B]"></i>
          <input
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder="Chat Name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        </div>

        <div className="border-2 w-[80%] bg-gray-400 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-1 rounded-lg">
          <i className="ri-user-add-fill text-2xl text-[#D30C7B]"></i>
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
        <button
          type="submit"
          className="bg-red-600 ml-50 -mt-2  font-semibold text-white p-2 rounded-lg "
        >
          Create
        </button>
      </form>
      <div className="flex mt-48 mx-6 h-full flex-col gap-4">
        {foundUsers.map((user, idx) => {
          const isSelected = selectedUsers.includes(user._id); // Check if user is selected
          return (
            <div
              onClick={() => {
                addMembersHandler(user);
                selectedUsersHandler(user);
              }}
              key={idx}
              className={`${
                isSelected ? "bg-red-500" : "bg-green-600"
              } border-2 h-16 py-2 cursor-pointer w-full flex justify-between items-center px-6 rounded-2xl`}
            >
              <div className="flex flex-col">
                <div className="flex justify-start items-center gap-2">
                  <h2>
                    {user.firstName} {user.lastName}{" "}
                    {user.gender === "male" ? (
                      <i className="text-[#2986cc]  ri-men-fill"></i>
                    ) : (
                      <i className="text-[#c90076] ri-women-fill"></i>
                    )}
                  </h2>
                </div>
                <h4>{user.username}</h4>
              </div>
              {isSelected ? (
                <i className="text-xl ri-close-circle-fill"></i>
              ) : (
                <i className="text-xl ri-add-circle-fill"></i>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreategroupPanel;
