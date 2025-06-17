import React, { useEffect, useRef, useState, useContext, lazy } from "react";
import { UserDataContext } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import gsap from "gsap";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import "../assets/style/Chats.css";
import BgImage from "../assets/theme/craft.jpg";
import profileImg from "../assets/profilePic.jpg";
import { toast } from "react-toastify";
const MessageBox = lazy(() => import("../components/MessageBox"));
const CreateChat = lazy(() => import("../components/CreateChat"));
const CreatePersonalChatPanel = lazy(() =>
  import("../components/CreatePersonalChatPanel")
);
const CreategroupPanel = lazy(() => import("../components/CreateGroupPanel"));
const AddTOGroup = lazy(() => import("../components/AddToGroup"));
const VideoReqPanel = lazy(() => import("../components/VideoReqPanel"));
const AboutPanel = lazy(() => import("../components/AboutPanel"));
const ChatRename = lazy(() => import("../components/ChatRename"));
const ViewChatDetails = lazy(() => import("../components/ViewChatDetails"));
const socket = io();

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blockedUsers = location.state;

  const [searchChats, setSearchChats] = useState("");
  const [foundChats, setFoundChats] = useState([]);
  const addMemberRef = useRef(null);
  const [createChat, setcreateChat] = useState(false);
  const searchNewMemberRef = useRef(null);
  const [createPersonalChatPanel, setCreatePersonalChatPanel] = useState(false);
  const [createGroupPanel, setCreateGroupPanel] = useState(false);
  const createGroupRef = useRef(null);
  const addToGroupRef = useRef(null);
  const [addToGroupPanel, setAddToGroupPanel] = useState(false);
  const [startChat, setStartChat] = useState(null);
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
  const [ViewChatDetailsPanel, setViewChatDetailsPanel] = useState(false);
  const ViewChatDetailsRef = useRef(null);
  const [isGrpAdmin, setIsGrpAdmin] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);
  const [socketMessages, setSocketMessages] = useState([]);

  //DONE
  useGSAP(() => {
    if (!createChat) {
      gsap.to(addMemberRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(addMemberRef.current, {
        y: "-100%",
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [createChat]);

  //DONE
  useGSAP(() => {
    if (!createPersonalChatPanel) {
      gsap.to(searchNewMemberRef.current, {
        y: "100%",
        opacity: 1,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(searchNewMemberRef.current, {
        y: "-100%",
        opacity: 1,
        ease: "power2.inOut",
      });
    }
  }, [createPersonalChatPanel]);

  //DONE
  useGSAP(() => {
    if (!createGroupPanel) {
      gsap.to(createGroupRef.current, {
        y: "100%",
        opacity: 1,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(createGroupRef.current, {
        y: "-100%",
        opacity: 1,
        ease: "power2.inOut",
      });
    }
  }, [createGroupPanel]);

  //DONE
  useGSAP(() => {
    if (!aboutPanel) {
      gsap.to(aboutRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(aboutRef.current, {
        x: "-30%",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [aboutPanel]);

  //DONE
  useGSAP(() => {
    if (!addToGroupPanel) {
      gsap.to(addToGroupRef.current, {
        y: "0%",
        opacity: 0,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(addToGroupRef.current, {
        y: "-100%",
        opacity: 1,
        ease: "power2.inOut",
      });
    }
  }, [addToGroupPanel]);

  useGSAP(() => {
    if (!ViewChatDetailsPanel) {
      gsap.to(ViewChatDetailsRef.current, {
        y: "0%",
        opacity: 1,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(ViewChatDetailsRef.current, {
        y: "-100%",
        opacity: 1,
        ease: "power2.inOut",
      });
    }
  }, [ViewChatDetailsPanel]);

  // useGSAP(() => {
  //   if (!videoReqPanel) {
  //     gsap.to(videoReqRef.current, {
  //       transform: "translateX(0%)",
  //       duration: 0.3,
  //     });
  //   } else {
  //     gsap.to(videoReqRef.current, {
  //       transform: "translateX(-110%)",
  //       duration: 0.3,
  //     });
  //   }
  // }, [videoReqPanel]);

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
        zIndex: 0,
        opacity: 0,
        duration: 0.3,
      });
    } else {
      gsap.to(chatRenameRef.current, {
        zIndex: 10,
        opacity: 1,
        duration: 0.3,
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
    setStartChat((prevId) => (prevId === chatId ? null : chatId));
    setReplyPopup(false);
    setAboutPanel(false);
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

  useEffect(() => {
    socket.on("userCount", (count) => {
      setOnlineUsers(count);
      // console.log(`Users online: ${onlineUsers}`);
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

        const allChats = response.data;

        // Filter chats by search keyword
        const filteredChats = allChats.filter((chat) =>
          chat.chatName.toLowerCase().includes(searchChats.toLowerCase())
        );

        // Filter based on chat type
        const finalChats = filteredChats.filter((chat) => {
          const isOneToOne = chat.members.length === 2;

          if (isOneToOne) {
            // Hide if either of the two members is blocked
            return chat.members.every(
              (member) => !user.user.blockedUsers.includes(member._id)
            );
          }

          // Always show group chats
          return true;
        });

        setFoundChats(finalChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    })();
  }, [searchChats, blockedUsers, createPersonalChatPanel, createGroupPanel]);

  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault(); // Disable tab key
      }
    };

    window.addEventListener("keydown", handleTabKey);

    return () => {
      window.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  useEffect(() => {
    if (chatTitle.groupAdmin === user?.user?._id) {
      setIsGrpAdmin(true);
    }
  }, [chatTitle]);

  return (
    <div className=" h-screen w-screen flex items-center  bg-[#1d3557]">
      <div className="h-full w-1/20 py-3 rounded-4xl text-xl flex flex-col items-center justify-between">
        <button className="mb-4  aspect-square w-[80%] hover:cursor-pointer  rounded-xl">
          <img
            onClick={() => navigate("/profile")}
            className="object-cover border-white border-2 w-full rounded-xl h-full"
            src={user?.user?.image?.url}
            alt="boy"
          />
        </button>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            T
          </span>
        </div>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            A
          </span>
        </div>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            L
          </span>
        </div>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            K
          </span>
        </div>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            Y
          </span>
        </div>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            T
          </span>
        </div>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            A
          </span>
        </div>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            L
          </span>
        </div>

        <div className="bg-gray-300 p-2 aspect-square flex items-center justify-center rounded-xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            K
          </span>
        </div>

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
          className="w-[24.4%] relative flex flex-col overflow-hidden gap-2 justify-between h-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <nav className=" fixed w-[23.15%] flex items-center justify-between px-4 h-16 rounded-t-4xl border-2 border-b-0 border-[#4E6766] bg-[#a8dadc] ">
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
          </nav>

          <div
            ref={addMemberRef}
            className="flex absolute  w-full z-30 -bottom-1/4 h-1/4 bg-[#a8dadc] items-center justify-center border-2  rounded-4xl"
          >
            <CreateChat
              setCreatePersonalChatPanel={setCreatePersonalChatPanel}
              setcreateChat={setcreateChat}
              setCreateGroupPanel={setCreateGroupPanel}
            />
          </div>
          <div
            ref={searchNewMemberRef}
            className=" w-full absolute h-full rounded-4xl -bottom-1/1 px-2 z-30 overflow-x-hidden  border-[#DAD1BE] border-2  bg-green-500"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <CreatePersonalChatPanel
              user={user}
              setFoundChats={setFoundChats}
              setCreatePersonalChatPanel={setCreatePersonalChatPanel}
            />
          </div>

          <div
            ref={createGroupRef}
            className="absolute -bottom-1/1 bg-red-400 rounded-4xl border-[#DAD1BE] border-2 z-30 w-full h-full overflow-x-hidden"
          >
            <CreategroupPanel
              user={user}
              setCreateGroupPanel={setCreateGroupPanel}
              setFoundChats={setFoundChats}
            />
          </div>

          <div
            ref={addToGroupRef}
            className=" w-full absolute h-full -bottom-1/1 rounded-4xl z-30  bg-red-400 overflow-x-hidden"
          >
            <AddTOGroup
              chatTitle={chatTitle}
              setAddToGroupPanel={setAddToGroupPanel}
            />
          </div>

          <div
            ref={ViewChatDetailsRef}
            className=" w-full absolute h-full -bottom-1/1 rounded-4xl z-30  bg-[#a8dadc] overflow-x-hidden"
          >
            <ViewChatDetails
              isGrpAdmin={isGrpAdmin}
              chatTitle={chatTitle}
              setViewChatDetailsPanel={setViewChatDetailsPanel}
            />
          </div>

          {/* <div
            ref={videoReqRef}
            className="h-40 w-60 rounded-2xl bg-green-400 fixed border-2 border-gray-500 -right-60 top-20"
          >
            <VideoReqPanel setVideoReqPanel={setVideoReqPanel} />
          </div> */}

          {/* <div
            ref={chatRenameRef}
            className="w-1/2 h-2/30 px-2 z-30 top-6 right-16 bg-red-500 text-[#457b9d] fixed"
          ></div> */}

          <div
            ref={chatRenameRef}
            className="w-1/2 top-6 right-16 fixed z-0 opacity-0 "
          >
            <ChatRename
              chatTitle={chatTitle}
              setChatRenamePanel={setChatRenamePanel}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setcreateChat(true);
            }}
            className="bg-blue-700 aspect-square hover:cursor-pointer z-20 absolute text-black text-3xl bottom-4 right-4 flex items-center justify-center rounded-full h-[50px]"
          >
            <i className="ri-add-line"></i>
          </button>

          <div
            className="flex items-start justify-start mt-16 pt-4 h-full flex-col w-full gap-1 rounded-b-4xl  bg-[#a8dadc] border-2 border-t-0 border-[#4E6766] overflow-x-hidden "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {foundChats.map((chat, idx) => {
              const isSelected = startChat === chat?._id;

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
                  className={`flex chats border-2 justify-start hover:cursor-pointer gap-4 border-[#4E6766]  w-full rounded-2xl  p-2 ${
                    isSelected ? " bg-[#e63946]!" : " "
                  } `}
                >
                  <div className="w-14 rounded-full aspect-square">
                    <img
                      className="object-cover rounded-full w-full h-full"
                      src={chatData?.image?.url || profileImg}
                      alt="profil picture"
                    />
                  </div>

                  {chat?.members?.length === 2 ? (
                    <div className="flex flex-col justify-center items-start">
                      <h2 className=" font-semibold">
                        {chatData?.firstName} {chatData?.lastName}
                      </h2>
                      <h6 className="italic">{chatData?.username}</h6>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-lg">
                      {chatData?.chatName}
                    </h3>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={aboutRef}
          className=" rounded-2xl z-50 border-2 w-40 bg-[#a8dadc] border-gray-500 absolute right-0 top-20"
        >
          <AboutPanel
            setSocketMessages={setSocketMessages}
            setSavedMessages={setSavedMessages}
            isGrpAdmin={isGrpAdmin}
            setIsGrpAdmin={setIsGrpAdmin}
            foundChats={foundChats}
            setFoundChats={setFoundChats}
            user={user}
            setAddToGroupPanel={setAddToGroupPanel}
            setViewChatDetailsPanel={setViewChatDetailsPanel}
            chatTitle={chatTitle}
            setChatRenamePanel={setChatRenamePanel}
            setAboutPanel={setAboutPanel}
          />
        </div>

        {/* ////////////////huge chat part////////////// */}
        <div
          className="w-[75%]"
          // onClick={() => setShowPopup(false)}
        >
          {startChat && (
            <MessageBox
              setSocketMessages={setSocketMessages}
              socketMessages={socketMessages}
              setSavedMessages={setSavedMessages}
              savedMessages={savedMessages}
              setViewChatDetailsPanel={setViewChatDetailsPanel}
              ViewChatDetailsPanel={ViewChatDetailsPanel}
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
