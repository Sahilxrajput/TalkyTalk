import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import "remixicon/fonts/remixicon.css";
import "../assets/style/signup.css";
import axios from "axios";
import profileImg from "../assets/profilePic.jpg";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import tax from "../assets/pic/tex.jpg";
import "../assets/style/signup.css";
import "../assets/style/Chats.css";
// import homeVid from "../assets/homeVid.mp4";
import Loading from "../components/Loading";

const Profile = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserDataContext);
  const [open, setOpen] = useState(false);
  const [unblockLoading, setUnblockLoading] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState({
    edit: false,
    blockeUser: false,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "Available",
  });

  const showBlockedUsers = async () => {
    setIsLoading((prev) => ({ ...prev, blockeUser: true }));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users`,
        {
          withCredentials: true,
        }
      );
      const responseArray = response.data.users;
      const blockedUsers = responseArray.filter((mem) =>
        user.user.blockedUsers.includes(mem._id)
      );
      setBlockedUsers(blockedUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => ({ ...prev, blockeUser: false }));
    }
  };

  const UnblockHandler = async (blockedUserId) => {
    setUnblockLoading((prev) => ({ ...prev, [blockedUserId]: true }));
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/unblock`,
        {
          blockerId: user.user._id,
          blockedId: blockedUserId,
        },
        { withCredentials: true }
      );
      toast.success("User unblock successfully");
      setBlockedUsers((prev) => prev.filter((u) => u._id !== blockedUserId));
    } catch (error) {
      console.error("Failed to block user:", error);
      toast.error("Unblock failed");
    } finally {
      setUnblockLoading((prev) => ({ ...prev, [blockedUserId]: false }));
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, edit: true }));
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update/${user.user._id}`,
        { formData },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        navigate("/home");
        setTimeout(() => window.location.reload(), 100);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning("At least one field must be provided");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, edit: false }));
    }
  };

  return (
    <div className="flex h-screen w-screen p-8  gradient-bg justify-between">
      <form
        onSubmit={(e) => submitHandler(e)}
        className=" w-1/4 h-full flex flex-col items-center justify-center gap-6 rounded-xl border-[#1d3557] border-1 relative overflow-hidden"
      >
        {/* Background image with opacity */}
        <div
          className=" absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${tax})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        />
        <div className="h-32 rounded-full border-2 border-white aspect-square z-10">
          <img
            className="w-full h-full  rounded-full object-cover"
            src={user.user.image.url || profileImg}
            alt="profile pic"
          />
        </div>
        <h1 className="text-red-400 font-bold text-2xl">Profile info</h1>
        <div className="w-8/10 border-2 border-[#1d3557]  text-[#1d3557]  flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-user-shared-line "></i>
          <input
            placeholder={`firstname :  ${user.user.firstName}`}
            name="firstName"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            onChange={(e) => changeHandler(e)}
          />
        </div>
        <div className="border-2 w-8/10 border-[#1d3557]  text-[#1d3557]  flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-user-received-line "></i>
          <input
            name="lastName"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder={`lastname :  ${user.user.lastName}`}
            onChange={(e) => changeHandler(e)}
          />
        </div>

        <div className="border-2 w-8/10 border-[#1d3557]  text-[#1d3557]  flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-user-line "></i>
          <input
            name="username"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder={`username :  ${user.user.username}`}
            onChange={(e) => changeHandler(e)}
          />
        </div>
        <div className="border-2 w-8/10 border-[#1d3557]  text-[#1d3557]  flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-quill-pen-ai-fill "></i>
          <input
            name="bio"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder={`bio :  ${user.user.bio}`}
            onChange={(e) => changeHandler(e)}
          />
        </div>
        <div className="flex justify-around items-center w-full">
          <button
            type="button"
            onClick={() => {
              showBlockedUsers();
              setOpen(!open);
            }}
            className="bg-blue-600 w-36 h-12  flex items-center justify-center  text-lg  font-sm cursor-pointer text-white otp active:scale-75 p-4 rounded-md focus:outline-none"
          >
            Blocked Users
          </button>
          <button
            className="bg-blue-600 w-24 h-12 cursor-pointer text-xl flex items-center justify-center text-white  font-sm otp active:scale-75 rounded-md focus:outline-none"
            type="submit"
          >
            {isLoading.edit ? <Loading /> : "Edit"}
          </button>
        </div>
      </form>

      {/* <div
        onClick={() => navigate("/home", { state: blockedUsers })}
        draggable={false}
        className="w-32 h-32 rounded-full cursor-pointer border-1 border-[#1d3557]  mx-auto bg-white"
      >
        {(
          <video
            className="w-full rounded-full aspect-square"
            autoPlay
            loop
            muted
          >
            <source src={homeVid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) || <h1>Home</h1>}
        <p className=""> Return to Home</p>
      </div> */}

      <div
        className={`w-1/4 flex flex-col overflow-x-hidden text-white border-[#1d3557] rounded-xl transition-all duration-300  ease-in-out z-50 ${
          open
            ? "max-h-full opacity-100 border-2"
            : "max-h-0 opacity-0 border-0"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          backgroundImage: `url(${tax})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {blockedUsers.length === 0 ? (
          <div className="flex justify-center py-16 text-2xl text-red-800 font-bold">
            <h1> &#9734; No blocked user found</h1>
          </div>
        ) : isLoading.blockeUser ? (
          <Loading />
        ) : (
          blockedUsers.map((blockedUser, idx) => (
            <div
              key={idx}
              className="h-20 p-4 w-full justify-between flex rounded-xl slide"
            >
              <div className="flex  gap-4 items-center justify-center">
                <div className="h-full rounded-full aspect-square">
                  <img
                    className="object-cover rounded-full w-full h-full"
                    src={
                      blockedUser && blockedUser.image
                        ? blockedUser.image.url
                        : ""
                    }
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-start ">
                  <h2>
                    {blockedUser?.firstName} {blockedUser?.lastName}
                  </h2>
                  <h4 className=" italic">@{blockedUser?.username}</h4>
                </div>
              </div>
              <button
                className="bg-blue-600 w-18 cursor-pointer text-white  flex items-center justify-center font-sm otp active:scale-75 rounded-md focus:outline-none"
                onClick={() => UnblockHandler(blockedUser._id)}
              >
                {unblockLoading[blockedUser._id] ? <Loading /> : "Unblock"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
