import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";
import texture from "../assets/pic/tex.jpg";

const CreatePersonalChatPanel = ({
  setCreatePersonalChatPanel,
  user,
  setFoundChats,
}) => {
  const [searchUser, setSearchUser] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addFriend, setAddFriend] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (searchUser.trim() === "") {
      setFoundUsers([]); 
      return;
    }
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

        if (!isCancelled) setFoundUsers(filtered);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setMainLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
      setFoundUsers([]);
    };
  }, [searchUser]);

  const submitHandler = async (user) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/personal`,
        { chatName: user.username, memberId: user._id },
        { withCredentials: true }
      );

      if (response.data.duplicate) {
        toast.info("Chat already exists with this user!");
      } else {
        toast.success("One-to-One chat created successfully!");
      }
      setFoundChats((prev) => [...prev, response.data.chat]);
      setCreatePersonalChatPanel(false);
      setSearchUser("");
      setFoundUsers([]);
      setSelectedUserId(null);
      setAddFriend("");
      setFoundChats([]);
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedUserHandler = (userId) => {
    setSelectedUserId((prevId) => (prevId === userId ? null : userId));
  };

  return (
    <div
      className="flex flex-col w-full h-full overflow-x-hidden justify-center rounded-4xl"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${texture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      ></div>
      <nav className="absolute flex flex-col items-center text-[#DAD1BE] rounded-4xl w-full z-20 h-[13%] top-0 left-0">
        <i
          onClick={() => {
            setCreatePersonalChatPanel(false);
            setSearchUser("");
            setSelectedUserId(null);
          }}
          className="text-2xl hover:cursor-pointer font-semibold ri-arrow-down-wide-fill"
        ></i>
        <div className="border-2 border-[#DAD1BE] w-9/10  flex items-center justify-between gap-2 px-3 p-2 rounded-lg">
          <i className="ri-find-replace-line"></i>
          <input
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="appearance-none border-none w-full bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder="Search"
          />
        </div>
      </nav>

      <div
        className="flex h-full w-full overflow-x-hidden mt-24 z-30 flex-col gap-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {" "}
        {mainLoading ? (
          <Loading />
        ) : searchUser.trim() !== "" && foundUsers.length === 0 ? (
          <h2 className="text-red-600 text-center text-xl font-semibold">
            &#9734; No User Found
          </h2>
        ) : (
          foundUsers.map((user, idx) => {
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
                    className="bg-blue-700 flex justify-center gap-2 hover:cursor-pointer  text-sm items-center py-2 text-white w-30 rounded-lg"
                  >
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <>
                        {" "}
                        Chat<i className="ri-sparkling-fill"></i>{" "}
                      </>
                    )}
                  </button>
                ) : (
                  <i className="ri-user-add-fill"></i>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CreatePersonalChatPanel;
