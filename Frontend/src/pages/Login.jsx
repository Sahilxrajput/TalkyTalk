import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/city.jpg";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import "../assets/style/signup.css";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useContext(UserDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { password, email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setUser(data); 
        localStorage.setItem("token", data.token);
        toast.success("User logged in successfully");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error Login:", error.response?.data || error.message);
      // console.error("Error Login:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <form
        className="bg-[#fccee84c] backdrop-blur-lg h-[450px] p-11 rounded-xl w-[600px] flex justify-center flex-col gap-10 items-center text-white"
        onSubmit={(e) => submitHandler(e)}
      >
        <h1 className="mt-2 text-3xl font-bold text-[#D30C7B] stroke-2 stroke-yellow-500 ">
          ~~~~ Welcome Talkytalk ~~~~{" "}
        </h1>

        <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-mail-ai-line text-[#D30C7B]"></i>
          <input
            name="email"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-lock-2-line text-[#D30C7B]"></i>
          <input
            name="password"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <i className={` cursor-pointer ${showPassword ? "ri-eye-off-line" : "ri-eye-line"}`}></i>{" "}
          </button>
        </div>

        <div className=" flex items-center justify-center "></div>
        <button
          className="bg-[#D30C7B] py-2 px-4 rounded-lg -mt-4 key active:scale-75 cursor-pointer"
          type="submit"
        >
          Log in <i className="ri-send-plane-fill"></i>
        </button>
        <h4 className="">
          <i className="ri-arrow-right-long-fill text-[#D30C7B]"></i>&nbsp;
          Don't have an account &nbsp;
          <Link
            to="/signup"
            className=" font-semibold underline text-[#D30C7B]"
          >
            Creat One
          </Link>
        </h4>
      </form>
    </div>
  );
};

export default Login;
