import React, { useEffect, useRef, useState, useContext, lazy } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import gsap from "gsap";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import "../assets/style/Chats.css";
import BgImage from "../assets/craft.jpg";
import { toast } from "react-toastify";
const MessageBox = lazy(() => import("../components/MessageBox"));
const AddMembers = lazy(() => import("../components/AddMembers"));
const CreatePersonalChatPanel = lazy(() =>
  import("../components/CreatePersonalChatPanel")
);
const CreategroupPanel = lazy(() => import("../components/CreateGroupPanel"));
const AddTOGroup = lazy(() => import("../components/AddToGroup"));
const VideoReqPanel = lazy(() => import("../components/VideoReqPanel"));
const AboutPanel = lazy(() => import("../components/AboutPanel"));
const ChatRename = lazy(() => import("../components/ChatRename"));
const RemoveFromGroup = lazy(() => import("../components/RemoveFromGroup"));
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
  const addToGroupRef = useRef(null);
  const [addToGroupPanel, setAddToGroupPanel] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState({});
  const [welcomeTag, setWelcomeTag] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const videoReqRef = useRef(false);
  const [videoReqPanel, setVideoReqPanel] = useState(false);
  const aboutRef = useRef(null);
  const [aboutPanel, setAboutPanel] = useState(false);
  const [replyPopup, setReplyPopup] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const replyRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useContext(UserDataContext);
  const [chatRenamePanel, setChatRenamePanel] = useState(false);
  const chatRenameRef = useRef(null);
  const [removeFromGroupPanel, setRemoveFromGroupPanel] = useState(false);
  const removeFromGroupRef = useRef(null);

  const navigate = useNavigate();

  useGSAP(() => {
    if (!addMemberpanel) {
      gsap.to(addMemberRef.current, {
        transform: "translateY(0.7%)",
        opacity: 0,
      });
    } else {
      gsap.to(addMemberRef.current, {
        transform: "translateY(-115%)",
        opacity: 1,
      });
    }
  }, [addMemberpanel]);

  useGSAP(() => {
    if (!searchNewMembelPanel) {
      gsap.to(searchNewMemberRef.current, {
        transform: "translateY(0%)",
        opacity: 0,
      });
    } else {
      gsap.to(searchNewMemberRef.current, {
        transform: "translateY(-104.7%)",
        opacity: 1,
      });
    }
  }, [searchNewMembelPanel]);

  useGSAP(() => {
    if (!addToGroupPanel) {
      gsap.to(addToGroupRef.current, {
        transform: "translateY(0%)",
        opacity: 0,
      });
    } else {
      gsap.to(addToGroupRef.current, {
        transform: "translateY(-104.7%)",
        opacity: 1,
      });
    }
  }, [addToGroupPanel]);

  useGSAP(() => {
    if (!removeFromGroupPanel) {
      gsap.to(removeFromGroupRef.current, {
        transform: "translateY(0%)",
        opacity: 0,
      });
    } else {
      gsap.to(removeFromGroupRef.current, {
        transform: "translateY(-104.7%)",
        opacity: 1,
      });
    }
  }, [removeFromGroupPanel]);

  useGSAP(() => {
    if (!createGroupPanel) {
      gsap.to(createGroupRef.current, {
        transform: "translateY(0%)",
        opacity: 0,
      });
    } else {
      gsap.to(createGroupRef.current, {
        transform: "translateY(-104.7%)",
        opacity: 1,
      });
    }
  }, [createGroupPanel]);

  useGSAP(() => {
    if (!videoReqPanel) {
      gsap.to(videoReqRef.current, {
        transform: "translateX(0%)",
        duration: 0.3,
      });
    } else {
      gsap.to(videoReqRef.current, {
        transform: "translateX(-110%)",
        duration: 0.3,
      });
    }
  }, [videoReqPanel]);

  useGSAP(() => {
    if (!aboutPanel) {
      gsap.to(aboutRef.current, {
        transform: "translateX(150%)",
        duration: 0.3,
      });
    } else {
      gsap.to(aboutRef.current, {
        transform: "translateX(-100%)",
        duration: 0.3,
      });
    }
  }, [aboutPanel]);

  useGSAP(() => {
    if (replyPopup) {
      gsap.to(replyRef.current, {
        transform: "translateY(-108%)",
        duration: 0.1,
      });
    } else {
      gsap.to(replyRef.current, {
        transform: "translateY(0%)",
        duration: 0.1,
      });
    }
  }, [replyPopup]);

  useGSAP(() => {
    if (!chatRenamePanel) {
      gsap.to(chatRenameRef.current, {
        transform: "translateY(0%)",
        duration: 0.3,
        scale: 0,
      });
    } else {
      gsap.to(chatRenameRef.current, {
        transform: "translateY(350%)",
        duration: 0.3,
        scale: 1,
      });
    }
  }, [chatRenamePanel]);

  const logouthandler = async () => {
    const confirmation = confirm("Are you sure you want to logout?");
    if (confirmation) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/logout`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          localStorage.removeItem("token");
          navigate("/login");
          toast.success("user logout successfully");
        } else {
          console.error("Logout failed:", response.data);
          toast.error("user logout failed");
        }
      } catch (error) {
        console.error("Error during logout:", error);
        toast.error("user logout failed");
      }
    } else {
       alert("Logout cancelled.");
    }
  };

  const selectedChatHandler = (chatId) => {
    setSelectedChatId((prevId) => (prevId === chatId ? null : chatId));
    setWelcomeTag(false);
  };

  const videoReqHandler = () => {
    setVideoReqPanel(!videoReqPanel);
    setAboutPanel(false);
  };

  const aboutHandler = () => {
    setAboutPanel(!aboutPanel);
    setVideoReqPanel(false);
  };

  const getChatData = (chat = chatTitle) => {
    ///personal Chat
    if (chat.members && user && user.user && chat.members.length == 2) {
      const otherMember = chat.members.find(
        (member) => member._id !== user.user._id
      );
      return otherMember ? otherMember : "";
    }
    /////group Chat
    if (chat.members && user && user.user && chat.members.length > 2) {
      const admin = chat.members.find((member) => member._id === user.user._id);
      return chat;
    }
  };

  useEffect(() => {
    getChatData();
  }, [chatTitle]);

  // useEffect(() => {
  //   socket.on("userCount", (roomId, count) => {
  //      if (roomId === chatTitle._id) {
  //     setOnlineUsers(count);
  //     console.log(`Users online: ${onlineUsers}`);
  //      }
  //   });

  //   return () => {
  //     socket.off("roomUserCount");
  //   };
  // }, [chatTitle._id]);

  useEffect(() => {
    socket.on("userCount", (count) => {
      setOnlineUsers(count);
      console.log(`Users online: ${onlineUsers}`);
    });

    return () => {
      socket.off("userCount");
    };
  }, [onlineUsers]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat`,
          { withCredentials: true }
        );
        const responseArray = response.data;
        const filtered = responseArray.filter((chat) =>
          ` ${chat.chatName}`.toLowerCase().includes(searchChats.toLowerCase())
        );

        const isOneToOne = filtered.some((chat) => chat.members.length === 2);
        if (isOneToOne) {
          const unblockedChats = filtered.filter((chat) =>
            chat.members.every(
              (member) => !user.user.blockedUsers.includes(member._id)
            )
          );
          setFoundChats(unblockedChats);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    })();
  }, [searchChats, foundChats]);

  //   useEffect(() => {
  //   if (chatUserId) {
  //     // Notify server that messages from chatUserId have been seen
  //     socket.emit('message_seen', {
  //       senderId: chatUserId,
  //       receiverId: currentUserId
  //     });
  //   }
  // }, [chatUserId]);

  // Listen for real-time seen confirmation
  // useEffect(() => {
  //   socket.on('messages_marked_seen', ({ receiverId }) => {
  //     console.log(`Messages seen by ${receiverId}`);
  //     // Optional: update UI to show "Seen"
  //   });

  //   return () => socket.off('messages_marked_seen');
  // }, []);
  return (
    <div className=" h-screen w-screen flex items-center overflow-hidden bg-[#030018] ">
      <div className="h-full w-1/20 py-3  bg-[#030018] text-xl flex flex-col items-center justify-between">
        <button className="mb-4  aspect-square w-[80%] hover:cursor-pointer  rounded-xl">
          <img
            onClick={() => navigate("/profile")}
            className="object-cover border-white border-2 w-full rounded-xl h-full"
            src={user?.user?.image?.url}
            alt="boy"
          />
        </button>

        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          T
        </span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          A
        </span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          L
        </span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          K
        </span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          Y
        </span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          T
        </span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          A
        </span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          L
        </span>
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
          K
        </span>
        <button
          onClick={logouthandler}
          className="py-2 mt-4 px-3 hover:cursor-pointer aspect-square w-[80%] flex items-center justify-center bg-gray-300 rounded-xl"
        >
          <i className="ri-logout-box-line"></i>
        </button>
      </div>
      <div
        className="basis-1/1 flex rounded-4xl mr-1 bg-cover bg-center h-[98%]"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        <div
          className="w-[24.4%] relative flex flex-col overflow-x-hidden gap-2 justify-between h-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className=" fixed w-[23.15%] flex items-center justify-between px-4 h-16 rounded-t-4xl border-r-2 border-[#4E6766] bg-[#FFDBDB] ">
            {!isFocused && (
              <h4 className=" ml-20 tracking-wider bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
                TalkyTalk
              </h4>
            )}

            <div
              className={`border-2 border-yellow-500 bg-gray-200 transition-[width] duration-300 ease-in-out hover:w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg ${
                isFocused ? "w-full" : "w-[12%]"
              }`}
            >
              <i className="ri-find-replace-line"></i>
              <input
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
            className="flex fixed w-[23%] z-30 top-180 items-center justify-center  bg-yellow-300 rounded-4xl"
          >
            <AddMembers
              setSearchNewMembelPanel={setSearchNewMembelPanel}
              setAddMemberpanel={setAddMemberpanel}
              setCreateGroupPanel={setCreateGroupPanel}
            />
          </div>
          <div
            ref={searchNewMemberRef}
            className=" w-[23%] fixed h-[682px] rounded-4xl top-180 px-2 pt-[3%] z-30 overflow-x-hidden bg-red-400"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <CreatePersonalChatPanel
              user={user}
              setFoundChats={setFoundChats}
              setSearchNewMembelPanel={setSearchNewMembelPanel}
            />
          </div>

          <div
            ref={addToGroupRef}
            className=" w-[23%] fixed h-[682px] top-180 rounded-4xl z-30  bg-red-400"
          >
            <AddTOGroup
              chatTitle={chatTitle}
              setAddToGroupPanel={setAddToGroupPanel}
            />
          </div>

          <div
            ref={removeFromGroupRef}
            className=" w-[23%] fixed h-[98.5%] top-180 rounded-4xl z-30  bg-red-400"
          >
            <RemoveFromGroup
              chatTitle={chatTitle}
              setRemoveFromGroupPanel={setRemoveFromGroupPanel}
            />
          </div>

          <div
            ref={createGroupRef}
            className="fixed top-180 z-30 w-[23%]  h-[98%]"
          >
            <CreategroupPanel
              user={user}
              setCreateGroupPanel={setCreateGroupPanel}
              setFoundChats={setFoundChats}
            />
          </div>

          <div
            ref={videoReqRef}
            className="h-40 w-60 rounded-2xl bg-green-400 fixed border-2 border-gray-500 -right-60 top-20"
          >
            <VideoReqPanel setVideoReqPanel={setVideoReqPanel} />
          </div>

          <div
            ref={aboutRef}
            className=" rounded-2xl  border-2 bg-green-400 border-gray-500 fixed -right-50 top-20"
          >
            <AboutPanel
              foundChats={foundChats}
              setFoundChats={setFoundChats}
              user={user}
              setAddToGroupPanel={setAddToGroupPanel}
              setRemoveFromGroupPanel={setRemoveFromGroupPanel}
              chatTitle={chatTitle}
              setChatRenamePanel={setChatRenamePanel}
              setAboutPanel={setAboutPanel}
            />
          </div>

          <div className="w-[70%] px-2 -top-18 right-5 fixed">
            <ChatRename
              chatTitle={chatTitle}
              setChatRenamePanel={setChatRenamePanel}
              chatRenameRef={chatRenameRef}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setAddMemberpanel(true);
            }}
            className="bg-blue-700 aspect-square hover:cursor-pointer z-20 absolute text-black text-3xl bottom-2 left-72 flex items-center justify-center rounded-full h-[50px]"
          >
            <i className="ri-add-line"></i>
          </button>

          <div
            className="flex items-start justify-start mt-16 pt-4 gap-4 h-full flex-col w-full rounded-b-4xl  bg-[#FFDBDB] border-r-2 border-[#4E6766] overflow-x-hidden px-4 "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {foundChats.map((chat, idx) => {
              const isSelected = selectedChatId === chat?._id;

              let chatData = getChatData(chat);

              return (
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setReplyPopup(false);
                    setChatTitle({ ...chat });
                    selectedChatHandler(chat._id);
                  }}
                  key={idx}
                  className={`flex chats justify-start hover:cursor-pointer  gap-4 border-2 border-[#4E6766]  w-full rounded-2xl  p-2 ${
                    isSelected ? "bg-red-500!" : " "
                  } `}
                >
                  <div className="w-14 rounded-full aspect-square">
                    <img
                      className="object-cover rounded-full w-full h-full"
                      src={chatData?.image?.url || user?.user?.image?.url}
                      alt="profil picture"
                    />
                  </div>
                  <div>
                    <h2 className=" font-semibold ">
                      {chatData?.username || chatData?.chatName}
                    </h2>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ////////////////huge chat part////////////// */}

        <div
          className="w-[75%] rounded-r-4xl py-2 pr-6 "
          // onClick={() => setShowPopup(false)}
        >
          {selectedChatId && (
            <MessageBox
              foundChats={foundChats}
              replyRef={replyRef}
              videoReqHandler={videoReqHandler}
              aboutHandler={aboutHandler}
              getChatData={getChatData}
              user={user}
              setShowPopup={setShowPopup}
              showPopup={showPopup}
              replyPopup={replyPopup}
              setReplyPopup={setReplyPopup}
              chatTitle={chatTitle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
