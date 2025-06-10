import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(UserDataContext);
  const [open, setOpen] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "Available",
  });
  const navigate = useNavigate();

  const showBlockedUsers = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`, {
      withCredentials: true,
    });
    const responseArray = response.data.users;
    const blockedUsers = responseArray.filter((mem) =>
      user.user.blockedUsers.includes(mem._id)
    );
    console.log(blockedUsers);
    setBlockedUsers(blockedUsers);
  };

  const UnblockHandler = async (blockedUserId) => {
    console.log(blockedUserId);
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
      // navigate("/home");
      // setTimeout(() => window.location.reload(), 100);
      console.log("User unblocked successfully:", response.data);
    } catch (error) {
      console.error("Failed to block user:", error);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const editHandler = async (e) => {
    e.preventDefault();
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
    }
  };

  useEffect(() => {
    console.log(blockedUsers);
  }, []);

  return (
    <div className="flex w-screen h-screen flex-col justify-center">
      <div className=" flex flex-col items-center justify-start  gap-8 p-8 bg-red-400 z-50 h-full left-0 top-0">
        <div className="h-52 rounded-full border-2  border-white bg-green-400 aspect-square ">
          <img
            className="w-full h-full  rounded-full object-cover"
            src={user.user.image.url}
            alt=""
          />
        </div>

        {/* /////bio////////// */}
        <div className="flex h-full w-full justify-between ">
          <form
            onSubmit={(e) => editHandler(e)}
            className="basis-1/3 flex flex-col items-center gap-6"
          >
            <div className="w-8/10 border-2 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-user-shared-line text-[#D30C7B]"></i>
              <input
                placeholder={`firstname :  ${user.user.firstName}`}
                name="firstName"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                onChange={(e) => changeHandler(e)}
              />
            </div>
            <div className="border-2 w-8/10 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-user-received-line text-[#D30C7B]"></i>
              <input
                name="lastName"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                placeholder={`lastname :  ${user.user.lastName}`}
                onChange={(e) => changeHandler(e)}
              />
            </div>

            <div className="border-2 w-8/10 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-user-line text-[#D30C7B]"></i>
              <input
                name="username"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                placeholder={`username :  ${user.user.username}`}
                onChange={(e) => changeHandler(e)}
              />
            </div>
            <div className="border-2 w-8/10 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-quill-pen-ai-fill text-[#D30C7B]"></i>
              <input
                name="bio"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                placeholder={`bio :  ${user.user.bio}`}
                onChange={(e) => changeHandler(e)}
              />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
              type="submit"
            >
              Edit
            </button>
          </form>
          <div className="flex w-full gap-6 ">
            <div
              className={` w-full ml-90 flex flex-col overflow-x-hidden bg-yellow-500 border border-gray-200 rounded-md transition-all duration-300  ease-in-out z-50 ${
                open ? "max-h-full opacity-100" : "max-h-0 opacity-0"
              }`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {blockedUsers.length === 0 ? (
                <div className="flex justify-center py-16 text-2xl text-gray-700 font-bold">
                  <h1>No blocked user found</h1>
                </div>
              ) : (
                blockedUsers.map((blockedUser, idx) => (
                  <div
                    key={idx}
                    className="h-20 p-4 w-full justify-between flex"
                  >
                    <div className="flex  gap-4 items-center justify-center">
                      <div className="h-full rounded-full aspect-square">
                        <img
                          className="object-cover rounded-full w-full h-full"
                          src={blockedUser?.image?.url}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col items-start ">
                        <h2>
                          {blockedUser?.firstName} {blockedUser?.lastName}
                        </h2>
                        <h4 className=" italic text-gray-700 ">
                          @{blockedUser?.username}
                        </h4>
                      </div>
                    </div>
                    <button
                      className="bg-blue-600 text-white rounded-xl px-2 text-sm"
                      onClick={() => UnblockHandler(blockedUser._id)}
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-12 w-full mr-12  justify-end ">
              <button
                onClick={() => {
                  showBlockedUsers();
                  setOpen(!open);
                }}
                className="bg-blue-600 text-white h-12  px-4 py-2 rounded-md focus:outline-none"
              >
                Blocked Users
              </button>
              <Link
                to={"/home"}
                className="bg-gray-600 h-12 border-2 text-white px-4 py-2 rounded-md focus:outline-none"
              >
                return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
