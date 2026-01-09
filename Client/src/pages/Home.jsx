import { useEffect, useRef, useState, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import gsap from "gsap";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import "../assets/style/Chats.css";
import profileImg from "../assets/pic/profilePic.jpg";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { API } from "../lib/api";
const MessageBox = lazy(() => import("../components/MessageBox"));
const CreateChat = lazy(() => import("../components/CreateChat"));
const CreatePersonalChatPanel = lazy(() =>
  import("../components/CreatePersonalChatPanel")
);
const CreategroupPanel = lazy(() => import("../components/CreateGroupPanel"));
const AddTOGroup = lazy(() => import("../components/AddToGroup"));
const AboutPanel = lazy(() => import("../components/AboutPanel"));
const ChatRename = lazy(() => import("../components/ChatRename"));
const ViewChatDetails = lazy(() => import("../components/ViewChatDetails"));
const socket = io();
import useAuth from "../hooks/useAuth";
import ChatCard from "../components/ChatCard";

const Home = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const blockedUsers = location.state;

  const [searchChats, setSearchChats] = useState("");
  const [foundChats, setFoundChats] = useState([]);
  const addMemberRef = useRef(null);
  const [createChat, setCreateChat] = useState(false);
  const searchNewMemberRef = useRef(null);
  const [createPersonalChatPanel, setCreatePersonalChatPanel] = useState(false);
  const [createGroupPanel, setCreateGroupPanel] = useState(false);
  const createGroupRef = useRef(null);
  const addToGroupRef = useRef(null);
  const [addToGroupPanel, setAddToGroupPanel] = useState(false);
  const [startChat, setStartChat] = useState(null);
  const [chatTitle, setChatTitle] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [videoReqPanel, setVideoReqPanel] = useState(false);
  const aboutRef = useRef(null);
  const [aboutPanel, setAboutPanel] = useState(false);
  const [replyPopup, setReplyPopup] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const replyRef = useRef(null);
  const [chatRenamePanel, setChatRenamePanel] = useState(false);
  const chatRenameRef = useRef(null);
  const [ViewChatDetailsPanel, setViewChatDetailsPanel] = useState(false);
  const ViewChatDetailsRef = useRef(null);
  const [isGrpAdmin, setIsGrpAdmin] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);
  const [socketMessages, setSocketMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const findChatName = (chat) => {
    try {
      if (chat.isGroupChat) return chat.chatName;
      const otherMember = chat.members.find((m) => m._id !== user._id);
      const chatName = otherMember.firstName;
      return chatName;
    } catch (error) {
      return "dummyName";
      console.error(error);
    }
  };

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
    if (!chat.isGroupChat) {
      const otherMember = chat.members.find(
        (member) => member._id !== user._id
      );
      return otherMember ? otherMember : "";
    }
    //group Chat
    else {
      const admin = chat.members.find((member) => member._id === user._id);
      return chat;
    }
  };

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
    const getAllChats = async () => {
      try {
        setIsLoading(true);

        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat`,
          { withCredentials: true }
        );

        console.log("chatData : ", data);

        const filteredChats = data.filter((chat) =>
          chat.chatName?.toLowerCase().includes(searchChats.toLowerCase())
        );

        const finalChats = filteredChats.filter((chat) => {
          if (!chat.isGroupChat) {
            return chat.members.every(
              (member) => !user.blockedUsers.includes(member._id)
            );
          }
          return true;
        });

        setFoundChats(finalChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getAllChats();
  }, []);


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
    if (chatTitle.groupAdmin === user._id) {
      setIsGrpAdmin(true);
    }
  }, [chatTitle, user]);

  return (
    <div className=" h-screen w-screen flex items-center p-1 bg-[#1d3557]">

      <div className="basis-1/1 flex rounded-4xl bg-cover bg-[#DDCECD] bg-center h-full">
        <div
          className="w-[24.4%] h-full relative flex flex-col overflow-hidden justify-between border-2 border-[#4E6766] rounded-t-4xl rounded-4xl bg-[#eee5e5]"
        >
          <nav className="w-full flex gap-4 items-center justify-between p-2 h-16">
            <button className="aspect-square hover:cursor-pointer h-full rounded-full">
              <img
                onClick={() => navigate("/profile")}
                className="object-cover border-white border-2 aspect-square rounded-full h-full"
                src={user?.image?.url}
                alt="boy"
              />
            </button>
            <div
              className={`border-2 w-full border-yellow-500 bg-gray-200 flex items-center justify-between gap-2 p-2 rounded-lg`}
            >
              <i className="ri-find-replace-line"></i>
              <input
                className="appearance-none border-none w-full bg-transparent focus:outline-none"
                type="text"
                value={searchChats}
                onChange={(e) => setSearchChats(e.target.value)}
                placeholder="Search"
              />
            </div>
          </nav>

          <div
            ref={addMemberRef}
            className="flex absolute w-full z-30 -bottom-1/4 h-1/4 bg-[#ddcecd] items-center justify-center border-t-2 border-[#4E6766] rounded-4xl"
          >
            <CreateChat
              setCreatePersonalChatPanel={setCreatePersonalChatPanel}
              setCreateChat={setCreateChat}
              setCreateGroupPanel={setCreateGroupPanel}
            />
          </div>

          {createPersonalChatPanel && (
            <div
              ref={searchNewMemberRef}
              className=" w-full absolute h-full rounded-4xl -bottom-1/1 px-2 z-30 overflow-x-hidden bg-[#EEE5E5]"
            >
              <CreatePersonalChatPanel
                user={user}
                setFoundChats={setFoundChats}
                setCreatePersonalChatPanel={setCreatePersonalChatPanel}
              />
            </div>
          )}
          {createGroupPanel && (
            <div
              ref={createGroupRef}
              className="absolute -bottom-1/1 rounded-4xl bg-[#EEE5E5] z-30 w-full h-full overflow-x-hidden"
            >
              <CreategroupPanel
                user={user}
                setCreateGroupPanel={setCreateGroupPanel}
                setFoundChats={setFoundChats}
              />
            </div>
          )}
          {addToGroupPanel && (
            <div
              ref={addToGroupRef}
              className=" w-full absolute h-full -bottom-1/1 rounded-4xl z-30  bg-red-400 overflow-x-hidden"
            >
              <AddTOGroup
                chatTitle={chatTitle}
                setAddToGroupPanel={setAddToGroupPanel}
              />
            </div>
          )}
          {ViewChatDetailsPanel && (
            <div
              ref={ViewChatDetailsRef}
              className=" w-full absolute h-full -bottom-1/1 rounded-4xl z-30 bg-[#eee5e5] overflow-x-hidden"
            >
              <ViewChatDetails
                isGrpAdmin={isGrpAdmin}
                chatTitle={chatTitle}
                setViewChatDetailsPanel={setViewChatDetailsPanel}
              />
            </div>
          )}
          {chatRenamePanel && (
            <div
              ref={chatRenameRef}
              className="w-1/2 top-6 right-16 fixed z-0 opacity-0 "
            >
              <ChatRename
                chatTitle={chatTitle}
                setChatRenamePanel={setChatRenamePanel}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setCreateChat(true);
            }}
            className="bg-[#28afb0] aspect-square hover:cursor-pointer z-20 absolute  text-[#37392e] text-3xl bottom-4 right-4 flex items-center justify-center rounded-full h-[50px]"
          >
            <i className="ri-add-line"></i>
          </button>

          <div
            className={`flex flex-col  gap-1 pt-4 h-full w-full px-2 overflow-x-hidden ${
              isLoading
                ? "items-center justify-center"
                : "items-start justify-start"
            } `}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {!isLoading && foundChats.length > 0 ? (
              foundChats.map((chat, idx) => {
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
                    className={`flex chats border-2 justify-start hover:cursor-pointer gap-4 border-[#4E6766]  w-full rounded-xl  p-2 ${
                      isSelected ? " bg-[#28afb0]!" : " "
                    } `}
                  >
                    <div className="w-14 rounded-full aspect-square text-[#19647e]">
                      <img
                        className="object-cover rounded-full w-full h-full"
                        src={chatData?.image?.url || profileImg}
                        alt="profil picture"
                      />
                    </div>

                    <div className="flex flex-col justify-center items-start">
                      <h2 className=" font-semibold">{findChatName(chat)}</h2>
                    </div>

                    {/* {!chat.isGroupChat ? (
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
                      )} */}
                  </button>
                );
              })
            ) : foundChats.length == 0 ? (
              <p>Please Start Chatting...</p>
            ) : (
              <Loading bg={"bg-red-500"} />
            )}
          </div>
        </div>

        <div
          ref={aboutRef}
          className=" rounded-2xl z-50 border-2 w-44 bg-[#eee5e5] border-gray-500 absolute right-0 top-20"
        >
          <AboutPanel
            setStartChat={setStartChat}
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

        {/* ----------------huge chat part----------------------------------> */}
        <div
          className="w-[75%]"
          // onClick={() => setShowPopup(false)}
        >
          {startChat && (
            <MessageBox
              findChatName={findChatName}
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
