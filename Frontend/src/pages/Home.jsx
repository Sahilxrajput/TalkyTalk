import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "remixicon/fonts/remixicon.css";
import Chats from "../components/Chats";
import MessageBox from "../components/MessageBox";
import gsap from "gsap";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import AddMembers from "../components/AddMembers";
import CreatePersonalChatPanel from "../components/CreatePersonalChatPanel";
import { useNavigate } from "react-router-dom";
import CreategroupPanel from "../components/CreateGroupPanel";
import ProfilePanel from "../components/ProfilePanel";


const socket = io();

 
const Home = () => {
  const [searchChats, setSearchChats] = useState("");
  const [foundChats, setFoundChats] = useState([]);
  const addMemberRef = useRef(null);
  const [addMemberpanel, setAddMemberpanel] = useState(false);
  const searchNewMemberRef = useRef(null);
  const [searchNewMembelPanel, setSearchNewMembelPanel] = useState(false);
  const [createGroupPanel, setCreateGroupPanel] = useState(false);
  const createGroupRef = useRef(null);
  const profileRef = useRef(null);
  const [profilePanel, setProfilePanel] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState({
    chatName: "BHU",
    chatId: "",
    members: "20",
  });
  const [welcomeTag, setWelcomeTag] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  

  const navigate = useNavigate();


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat`,
          { withCredentials: true }
        );
        const responseArray = response.data;
        const filtered = responseArray.filter((chat) =>
          ` ${chat.chatName}`.toLowerCase().includes(searchChats.toLowerCase())
        );
        setFoundChats(filtered);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats(); //  call the async function
  }, [searchChats]);

  useGSAP(() => {
    if (addMemberpanel) {
      gsap.to(addMemberRef.current, {
        transform: "translateY(0.7%)",
      });
    } else {
      gsap.to(addMemberRef.current, {
        transform: "translateY(110%)",
      });
    }
  }, [addMemberpanel]);

  useGSAP(() => {
    if (searchNewMembelPanel) {
      gsap.to(searchNewMemberRef.current, {
        transform: "translateY(0%)",
      });
    } else {
      gsap.to(searchNewMemberRef.current, {
        transform: "translateY(110%)",
      });
    }
  }, [searchNewMembelPanel]);

  useGSAP(() => {
    if (profilePanel) {
      gsap.to(profileRef.current, {
        transform: "translateY(0%)",
      });
    } else {
      gsap.to(profileRef.current, {
        transform: "translateY(110%)",
      });
    }
  }, [profilePanel]);

  useGSAP(() => {
    if (createGroupPanel) {
      gsap.to(createGroupRef.current, {
        // opacity:1,
        transform: "translateY(0%)",
      });
    } else {
      gsap.to(createGroupRef.current, {
        //opacity:0,
        transform: "translateY(110%)",
      });
    }
  }, [createGroupPanel]);

const logouthandler = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.removeItem("token"); // Remove token by key only
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Logout failed:", response.data);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const selectedChatHandler = (chatId) => {
    setSelectedChatId((prevId) => (prevId === chatId ? null : chatId));
    setWelcomeTag(false);
  };

  const chatTitleHandler = async (chat) => {
    setChatTitle({
      chatId: chat._id || "68155fb02f9917d8976c9944",
      chatName: chat.chatName || "talkyTalk",
      members: chat.members.length || 0,
    });
  };

  const profileOpenHandler = async () => {
    setProfilePanel(true);
  };


  // useEffect(() => {
  //   socket.on("userCount", (roomId, count) => {
  //      if (roomId === chatTitle.chatId) {
  //     setOnlineUsers(count);
  //     console.log(`Users online: ${onlineUsers}`);
  //      }
  //   });

  //   return () => {
  //     socket.off("roomUserCount");
  //   };
  // }, [chatTitle.chatId]);
  


  useEffect(() => {
    socket.on("userCount", (count) => {
      setOnlineUsers(count);
      console.log(`Users online: ${onlineUsers}`);
    });

    return () => {
      socket.off("userCount");
    };
  }, [onlineUsers]);


  return (
    <div className=" h-screen w-screen flex items-center overflow-hidden bg-[#030018] ">
      <div className="h-full w-1/20 py-3  bg-[#030018] text-xl flex flex-col items-center justify-between">
        <button className="mb-4  aspect-square w-[80%]  bg-gray-300 rounded-xl">
          <img
            onClick={profileOpenHandler}
            className="object-cover w-full h-full"
            src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
            alt="boy"
          />
        </button>
        <span className="py-2 px-3 aspect-square w-[80%] flex items-center justify-center bg-gray-300 rounded-xl">
          <i className="ri-chat-1-fill"></i>
        </span>
        <span className="py-2 px-3 aspect-square w-[80%] flex items-center justify-center bg-gray-300 rounded-xl">
          <i className="ri-folder-fill"></i>
        </span>
        <span className="py-2 px-3 aspect-square w-[80%] flex items-center justify-center bg-gray-300 rounded-xl">
          <i className="ri-folder-fill"></i>
        </span>
        <span className="py-2 px-3 aspect-square w-[80%] flex items-center justify-center bg-gray-300 rounded-xl">
          <i className="ri-folder-fill"></i>
        </span>

        <span className="py-2 px-3 aspect-square w-[80%] flex items-center justify-center bg-gray-300 rounded-xl">
          <i className="ri-inbox-archive-fill"></i>
        </span>

        <button
          onClick={logouthandler}
          className="py-2 mt-4 px-3 aspect-square w-[80%] flex items-center justify-center bg-gray-300 rounded-xl"
        >
          <i className="ri-logout-box-line"></i>
        </button>
      </div>
      <div className="basis-1/1 flex rounded-4xl mr-2 bg-[#F1F5F2] h-[98%]">
        <div
          className="w-[25%] relative flex flex-col overflow-x-hidden gap-2 justify-between h-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className=" fixed w-[23.70%] flex items-center justify-center h-16 rounded-t-4xl bg-[#F1F5F2] ">
            <div className="border-2 border-yellow-500  bg-gray-400 w-9/10  flex items-center justify-between gap-2 px-3 py-2 rounded-lg">
              <i className="ri-find-replace-line"></i>
              <input
                className="appearance-none border-none w-full bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                value={searchChats}
                onChange={(e) => setSearchChats(e.target.value)}
                placeholder="Search"
              />
            </div>
          </div>
          <div
            ref={addMemberRef}
            className="flex fixed w-[23%] z-20  bottom-2  items-center justify-center  bg-yellow-300 rounded-4xl"
          >
            <AddMembers
              setSearchNewMembelPanel={setSearchNewMembelPanel}
              setAddMemberpanel={setAddMemberpanel}
              setCreateGroupPanel={setCreateGroupPanel}
            />
          </div>
          <div
            ref={searchNewMemberRef}
            className=" w-[23%] fixed h-[682px] rounded-4xl  z-20  bg-red-400"
          >
            <CreatePersonalChatPanel
              setSearchNewMembelPanel={setSearchNewMembelPanel}
            />
          </div>
          <div
            ref={profileRef}
            className=" w-[23%] fixed h-[682px] rounded-4xl  z-20  bg-red-400"
          >
            <ProfilePanel setProfilePanel={setProfilePanel} />
          </div>
          <div
            ref={createGroupRef}
            className="fixed bottom-[7px] z-20 w-[23%]  h-[98%]"
          >
            <CreategroupPanel setCreateGroupPanel={setCreateGroupPanel} />
          </div>

          <button
            type="button"
            onClick={() => {
              setAddMemberpanel(true);
            }}
            className="bg-blue-700 aspect-square z-10 fixed text-black text-3xl bottom-16 left-90 flex items-center justify-center rounded-full h-[50px]"
          >
            <i className="ri-add-line"></i>
          </button>

          <div
            className="flex items-start justify-start mt-16 pt-4 gap-2 h-full flex-col w-full rounded-b-4xl bg-[#F1F5F2] overflow-x-hidden px-4 "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {foundChats.map((chat, idx) => {
              const isSelected = selectedChatId === chat._id;

              return (
                <button
                  onClick={() => {
                    chatTitleHandler(chat);
                    selectedChatHandler(chat._id);
                  }}
                  key={idx}
                  className={`flex justify-start gap-4 w-full rounded-2xl  p-2 ${
                    isSelected ? "bg-red-500 border-2 " : " "
                  } `}
                >
                  <div className="w-14 rounded-full aspect-square">
                    <img
                      className="object-cover rounded-full w-full h-full"
                      src="https://i.guim.co.uk/img/media/53e33368ee15c494000585b83fbeefc16e6de41e/0_197_3500_2100/master/3500.jpg?width=465&dpr=1&s=none&crop=none"
                      alt="profil"
                    />
                  </div>
                  <div>
                    <h2>{chat.chatName}</h2>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ////////////////huge chat part////////////// */}

        <div className="w-[75%] rounded-r-4xl py-2 pr-6 ">
          {welcomeTag ? (
            <div className="flex flex-col items-center gap-4 justify-center ">
              <h1 className="text-6xl font-semibold text-pink-700 ">
                WELCOME to
              </h1>
              <h1 className="text-8xl font-black text-pink-700 tracking-wider ">
                {" "}
                TalkyTalk
              </h1>
            </div>
          ) : (
            <div className="flex justify-between h-1/10 border-b-2 items-center w-full ">
              <div>
                <h1 className="text-3xl font-semibold">{chatTitle.chatName}</h1>
                <h4>
                  {chatTitle.members} members, &nbsp; {onlineUsers} online
                </h4>
              </div>
              <div className="flex justify-end gap-6 items-center w-1/10 text-2xl">
                <i className="ri-find-replace-line"></i>
                <i className="ri-video-on-fill"></i>
                <i className="ri-phone-fill"></i>
                <i className="ri-menu-3-line"></i>
              </div>
            </div>
          )}
        <MessageBox  chatTitle={chatTitle} />
        </div>
      </div>
    </div>
  );
};

export default Home;
