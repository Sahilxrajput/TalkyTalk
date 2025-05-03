import React, { useEffect, useRef, useState } from "react";
import "remixicon/fonts/remixicon.css";
import Chats from "../components/Chats";
import MessageBox from "../components/MessageBox";
import gsap from "gsap";
import axios from "axios";
import io from "socket.io-client";
import { useGSAP } from "@gsap/react";
import AddMembers from "../components/AddMembers";
import CreatePersonalChatPanel from "../components/CreatePersonalChatPanel";
import { useNavigate } from "react-router-dom";
import CreategroupPanel from "../components/CreategroupPanel";


const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});


const Home = () => {
  const [searchChats, setSearchChats] = useState("");
  const [foundChats, setFoundChats] = useState([]);
  const addMemberRef = useRef(null);
  const [addMemberpanel, setAddMemberpanel] = useState(false);
  const searchNewMemberRef = useRef(null);
  const [searchNewMembelPanel, setSearchNewMembelPanel] = useState(false);
  const [createGroupPanel, setCreateGroupPanel] = useState(false);
  const createGroupRef = useRef(null);
  const [chatTitle, setChatTitle] = useState({
    chatName:"abbu",
    members:"20",
    online:"12",
  })

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat`,
          { withCredentials: true }
        );
        const responseArray = response.data;
        console.log('====================================');
        console.log(responseArray);
        console.log('====================================');
        const roomToJoin =  responseArray._id || []
        socket.emit("joinRoom", roomToJoin); // Join the new group room

        const filtered = responseArray.filter((chat) =>
          ` ${chat.chatName}`.toLowerCase().includes(searchChats.toLowerCase())
        );
         setFoundChats(filtered);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats(); //  call the async function
    if (searchChats.trim() !== "") {
    }
  }, [searchChats]);

  useGSAP(() => {
    if (addMemberpanel) {
      gsap.to(addMemberRef.current, {
        transform: "translateY(1.5%)",
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

  const chatTitleHandler = (chat)=>{
    setChatTitle({
      chatName:chat.chatName,
      members:chat.members.length,
    })
  }

  return (
    <div className=" h-screen w-screen flex items-center overflow-hidden bg-[#030018] ">
      <div className="h-full w-1/20 py-3  bg-[#030018] text-xl flex flex-col items-center justify-between">
        <span className="mb-4  aspect-square w-[80%]  bg-gray-300 rounded-xl">
          <img
            className="object-cover w-full h-full"
            src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
            alt="boy"
          />
        </span>
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
      <div className="basis-1/1 flex rounded-4xl mr-1 bg-[#FBFAF8] h-[98%]">
        <div
          className="w-[25%] relative flex flex-col overflow-x-hidden gap-2 justify-between h-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className=" fixed w-[23.75%] flex items-center justify-center h-16 rounded-t-4xl bg-white ">
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
            className="flex items-start justify-start mt-16 pt-4 gap-2 h-full flex-col w-full rounded-b-4xl bg-white overflow-x-hidden px-4 "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* <Chats foundChats={foundChats} /> */}

            {foundChats.map((chat, idx) => (
              <button
              onClick={()=>chatTitleHandler(chat)}
                key={idx}
                className="flex justify-start gap-4 w-full rounded-2xl bg-amber-500 p-2 "
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
            ))}
          </div>
        </div>

        {/* ////////////////huge chat part////////////// */}
        <div className="w-[75%] py-2 pr-6 ">
          <div className="flex justify-between h-1/10  bg-amber-500 border-b-2 items-center w-full ">
            <div>
              <h1 className="text-3xl font-semibold">{ chatTitle.chatName}</h1>
              <h4>{ chatTitle.members} members, &nbsp; { chatTitle.online} online</h4>
            </div>
            <div className="flex justify-end gap-6 items-center w-1/10 text-2xl">
              <i className="ri-find-replace-line"></i>
              <i className="ri-phone-line"></i>
              <i className="ri-menu-3-line"></i>
            </div>
          </div>
          {/* <div className="border-red-500 px-2 border-2  h-8/10">
            
          </div> */}
          <MessageBox />
        </div>
      </div>
    </div>
  );
};

export default Home;
