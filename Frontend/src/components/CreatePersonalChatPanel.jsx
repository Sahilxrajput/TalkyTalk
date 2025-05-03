import React, { useEffect, useState } from "react";
import axios from "axios";
import io  from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

const CreatePersonalChatPanel = ({ setSearchNewMembelPanel }) => {

  const [searchUser, setSearchUser] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addFriend, setAddFriend] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users`
      , { withCredentials: true }   );
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
    } 
    return () => {
      // Cleanup logic if needed
    };
  }, [searchUser]);

  const submitHandler = async (user) => {    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/personal`,
        { chatName:user.username, members: [user._id] }, { withCredentials: true } 
      );
      console.log("Group created:", response.data);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  


const selectedUserHandler = (userId) => {
    setSelectedUserId((prevId) => (prevId === userId ? null : userId));
};
  
  return (
  
    <div className="px-2 h-screen pt-[15%]">
      <div className="flex w-full flex-col justify-center p-2">
        <div
          className="fixed flex flex-col items-center w-full bg-red-400 z-50 h-[15%] left-0 top-0"
        >
          <i
            onClick={() => setSearchNewMembelPanel(false)}
            className="text-2xl  text-gray-700 font-semibold ri-arrow-down-wide-fill"
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
        className="flex h-screen w-full mt-12 overflow-y-auto overflow-x-hidden flex-col gap-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {foundUsers.map((user, idx) => {
          const isSelected = selectedUserId === user._id;

          return (
            <div
            onClick={() => selectedUserHandler(user._id)}    
              key={idx}
              className={` h-16 py-2 w-full px-6 flex justify-between items-center rounded-2xl ${
                isSelected ? "bg-red-500 " : "bg-yellow-400"
              }`}
            >
              <div className="flex flex-col items-start ">
                <div className="flex justify-start items-center gap-2">
                  <h2>
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.gender === "male" ? (
                    <i className="text-[#2986cc] ri-men-fill"></i>
                  ) : (
                    <i className="text-[#c90076] ri-women-fill"></i>
                  )}
                </div>
                <h4>{user.username}</h4>
              </div>
              {isSelected ? (
                 <button 
                 type="submit"
                 onClick={(e)=>{
                  e.stopPropagation();
                  setAddFriend(prev => [...prev, user._id]);
                  submitHandler(user)}}
                 className="bg-blue-700 flex justify-between text-sm -mr-2 items-center p-2 rounded-lg">Chat<i class="ri-sparkling-fill"></i></button>       
                 ) : (
                <i class="ri-user-add-fill"></i>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreatePersonalChatPanel;
