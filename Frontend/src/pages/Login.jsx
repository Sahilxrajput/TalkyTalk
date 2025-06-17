import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import "../assets/style/signup.css";
import { toast } from "react-toastify";
import LogInSvg from "../assets/svg/logIn.svg";
import Loading from "../components/Loading";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useContext(UserDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { password, email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data;
        setUser(data);
        localStorage.setItem("token", data.token);
        toast.success("User logged in successfully");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error Login:", error.response?.data || error.message);
      // console.error("Error Login:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  if (email.trim() !== "" && password.trim() !== "") {
    setIsDisabled(false);
  } else {
    setIsDisabled(true);
  }
}, [email, password]);

  

  return (
    <div className="w-screen h-screen flex  gradient-bg gap-20 items-center justify-center bg-center">
      <div className=" w-120 -bottom-10 left-0">
        <img
          src={LogInSvg}
          alt="svg"
          className="drop-shadow-2xl drop-shadow-black-900"
        />
      </div>

      <form
        className="bg-[#fccee84c] border-[#1d3557] border-2 backdrop-blur-lg h-[450px] py-11 rounded-xl w-[400px] flex justify-center flex-col gap-10 items-center text-white"
        onSubmit={(e) => submitHandler(e)}
      >
        <h1 className="mt-2 text-3xl font-bold text-[#D30C7B]">
          ~Welcome to Talkytalk~
        </h1>

        <div className="border-2 w-[80%] border-[#1d3557] font-bold text-[#1d3557] flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-mail-ai-line "></i>
          <input
            name="email"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="border-2 w-[80%] border-[#1d3557] font-bold text-[#1d3557] flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-lock-2-line "></i>
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
            <i
              className={` cursor-pointer ${
                showPassword ? "ri-eye-off-line" : "ri-eye-line"
              }`}
            ></i>{" "}
          </button>
        </div>

        <div className=" flex items-center justify-center "></div>
        <button
          disabled={isDisabled}
          className={`bg-[#D30C7B] py-2 w-24 rounded-lg flex items-center justify-center key active:scale-75 ${isDisabled ? 'opacity-70 cursor-not-allowed ' : 'opacity-100 cursor-pointer'}`}
          type="submit"
        >
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {" "}
              Log in <i className="ri-send-plane-fill"></i>{" "}
            </>
          )}
        </button>
        <h4 className=" text-[#1d3557]">
          <i className="ri-arrow-right-long-fill"></i>&nbsp; Don't have an
          account &nbsp;
          <Link
            to="/signup"
            className=" font-semibold underline text-[#D30C7B]"
          >
            Creat One
          </Link>
        </h4>
      </form>

      {/* <div className="w-full mx-auto bg-yellow-500">
  <video className="w-full h-auto" autoPlay loop muted>
    <source src={loginVid} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div> */}
    </div>
  );
};

export default Login;
