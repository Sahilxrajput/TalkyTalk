import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/style/signup.css";
import "remixicon/fonts/remixicon.css";
import profileImg from "../../public/boy.png";

const SignUpTwo = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    firstName: "",
    lastName: "",
    username: "",
    bio: "Online!",
    url: "",
    filename: "",
  });


  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const stepsHandler = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        const data = response.data;
        setUser(data); // Save user data to context
        toast.success("User signedUp successfully ");
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        toast.error("Something went wrong");
        console.error("Error signing up:", response.data);
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
    }
  };

  const handleSendOtp = async () => {
    const email = formData.email.trim();
    console.log(isValidEmail(email));
    if (email === "" || !isValidEmail(email)) {
      toast.warn("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/send-otp`,
        { to: formData.email },
        { withCredentials: true }
      );
      toast.success("OTP sent successfully!");
      setStep(2);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false); // re-enable button
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center  bg-green-600 bg-cover bg-no-repeat bg-center">
      <div className="bg-[#fccee84c] backdrop-blur-lg h-[500px] p-11 rounded-xl w-[600px] flex justify-center flex-col gap-10 items-center text-white">
        {step === 1 && (
          <h1 className="mt-2 text-3xl font-bold text-[#D30C7B] stroke-2 stroke-yellow-500 ">
            ~~~~ Welcome Talkytalk ~~~~{" "}
          </h1>
        )}
        {step === 1 && (
          <form
            className="w-full h-full  flex justify-center flex-col gap-10 items-center text-white"
            onSubmit={(e) => stepsHandler(e)}
          >
            <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-mail-ai-line text-[#D30C7B]"></i>
              <input
                name="email"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                value={formData.email}
                placeholder="Email"
                onChange={(e) => changeHandler(e)}
              />
            </div>
            <div className="flex justify-between w-[80%] ">
              <div className="border-2 w-[70%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
                <i className="ri-lock-2-line text-[#D30C7B]"></i>
                <input
                  name="otp"
                  className="appearance-none border-none  bg-transparent p-0 m-0 focus:outline-none"
                  type="text"
                  value={formData.otp}
                  placeholder="Otp"
                  onChange={(e) => changeHandler(e)}
                />
              </div>
              <button
                className={`px-2 rounded-lg transition duration-200 ${
                  loading
                    ? "bg-[#32746D] cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
                onClick={handleSendOtp}
                type="button"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-end px-4 circle-loader gap-2 h-5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#b3d3e8]"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#b3d3e8]"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#b3d3e8]"></span>
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
            <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-lock-2-line text-[#D30C7B]"></i>
              <input
                name="password"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                value={formData.password}
                placeholder="Password"
                onChange={(e) => changeHandler(e)}
              />
            </div>
            <button
              className={`bg-[#D30C7B] py-2 px-8  rounded-lg transition-opacity duration-300 
                ${
                  step === 2
                    ? "cursor-pointer opacity-100"
                    : "cursor-not-allowed opacity-50"
                }
              `}
              // disabled={step === 1}
              type="submit"
            >
              Next
            </button>
          </form>
        )}
        {step === 2 && (
          <form
            className="w-full h-full  flex justify-center flex-col gap-10 items-center text-white"
            onSubmit={(e) => submitHandler(e)}
          >
            <div className="flex justify-center items-center gap-6  w-full ">
              {imagePreview ? (
                <img
                  className="rounded-full object-cover w-20 border-2 aspect-square"
                  src={imagePreview}
                  alt="Preview"
                  width="50"
                />
              ) : (
                <img
                  className="rounded-full object-cover w-20 border-2 aspect-square"
                  src={profileImg}
                  alt="Preview"
                  width="50"
                />
              )}
              <label
                htmlFor="fileInput"
                className=" absolute left-[49%] top-[5%]  p-6 rounded-full cursor-pointer text-3xl font-bold"
              >
                <i className="ri-pencil-line"></i>{" "}
              </label>
              <input
                className=" hidden "
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex justify-between gap-4 w-[80%] ">
              <div className="border-2  border-yellow-500 flex items-center justify-start gap-2 px-3 py-2 rounded-lg">
                <i className="ri-lock-2-line text-[#D30C7B]"></i>
                <input
                  name="otp"
                  className="appearance-none border-none bg-transparent p-0 m-0 focus:outline-none"
                  type="text"
                  value={formData.firstName}
                  placeholder="First Name"
                  onChange={(e) => changeHandler(e)}
                />
              </div>
              <div className="border-2 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
                <i className="ri-lock-2-line text-[#D30C7B]"></i>
                <input
                  name="text"
                  className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                  value={formData.lastName}
                  placeholder="Last Name"
                  onChange={(e) => changeHandler(e)}
                />
              </div>
            </div>
            <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-mail-ai-line text-[#D30C7B]"></i>
              <input
                name="email"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                value={formData.username}
                placeholder="User Name"
                onChange={(e) => changeHandler(e)}
              />
            </div>
            <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-mail-ai-line text-[#D30C7B]"></i>
              <input
                name="bio"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                value={formData.bio}
                placeholder="bio"
                onChange={(e) => changeHandler(e)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#D30C7B] py-2 px-8 rounded-lg"
              onClick={(e) => submitHandler(e)}
            >
              Sign in <i className="ri-send-plane-fill"></i>
            </button>
          </form>
        )}

        <h4 className="">
          <i className="ri-arrow-right-long-fill text-[#D30C7B]"></i>&nbsp;
          Already have an account &nbsp;
          <Link
            to="/signup"
            className=" font-semibold underline text-[#D30C7B]"
          >
            Creat One
          </Link>
        </h4>
      </div>
    </div>
  );
};

export default SignUpTwo;
