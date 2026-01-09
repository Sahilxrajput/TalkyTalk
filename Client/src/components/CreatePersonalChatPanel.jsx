import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";
import ChatCard from "./ChatCard";

const CreatePersonalChatPanel = ({
  setCreatePersonalChatPanel,
  user,
  setFoundChats,
}) => {
  const [searchUser, setSearchUser] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const submitHandler = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/personal`,
        { memberId: userId },
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
      //   setAddFriend("");
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
    <div className="flex flex-col w-full h-full overflow-x-hidden justify-center rounded-4xl text-[#19647e]">
      <nav className="absolute flex flex-col items-center rounded-4xl w-full z-20 h-[13%] top-0 left-0">
        <i
          onClick={() => {
            setCreatePersonalChatPanel(false);
            setSearchUser("");
            setSelectedUserId(null);
          }}
          className="text-2xl hover:cursor-pointer font-semibold ri-arrow-down-wide-fill"
        ></i>
        <div className="border-2 border-[#19647e] w-9/10  flex items-center justify-between gap-2 px-3 p-2 rounded-lg">
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
        className="flex h-full w-full overflow-x-hidden mt-24 z-30 flex-col gap-2 relative"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {mainLoading ? (
          <Loading />
        ) : searchUser.trim() !== "" && foundUsers.length === 0 ? (
          <h2 className="text-[#37392e] text-center text-xl font-semibold">
            &#9734; No User Found
          </h2>
        ) : (
          filteredUsers.map((user, idx) => {
            const isSelected = selectedUserId === user._id;

            return (
              <ChatCard
                onSelect={(param) => selectedUserHandler(param)}
                isSelected={isSelected}
                idx={idx}
                user={user}
              />
            );
          })
        )}
        {selectedUserId && (
          <button
            className="bg-blue-600 text-[#EEE5E5] cursor-pointer absolute bottom-4 right-2 rounded-full h-12 text-3xl aspect-square"
            onClick={() => submitHandler(selectedUserId)}
          >
           {isLoading ? <Loading/> : <i class="ri-check-fill"></i>}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatePersonalChatPanel;
