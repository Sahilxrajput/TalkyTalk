import axios from "axios";
import React, { useState, useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/style/signup.css";
import "remixicon/fonts/remixicon.css";
import profileImg from "../assets/profilePic.jpg";
import Loading from "../components/Loading";

const SignUpTwo = () => {
  const { user, setUser } = useContext(UserDataContext);
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
    bio: "",
    url: "",
    filename: "",
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const stepsHandler = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const signinHandler = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/signup`,
        formDataToSend,
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
        toast.success("User signed up successfully");
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        toast.error("Something went wrong");
        console.error("Error signing up:", response.data);
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      toast.error("Signup failed");
    } finally {
      setLoading(false); // Always resets, even on error
    }
  };

  const otpHandler = async () => {
    const email = formData.email.trim();

    console.log(isValidEmail(email));
    if (email === "" || !isValidEmail(email)) {
      toast.warn("Please enter a valid email address");
      return;
    }
    setLoading(true);
    if (step == 1) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/get-otp`,
          { email: formData.email },
          { withCredentials: true }
        );
        toast.success("OTP sent successfully!");
        setStep(2);
      } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false); 
      }
    } 
    else if (step == 2) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/verify-otp`,
          { enteredOtp: formData.otp, email: formData.email },
          { withCredentials: true }
        );
        toast.success("OTP verified successfully!");
        setStep(3);
      } catch (error) {
        toast.error("Invalid OTP. Please try again.");
      } finally {
        setLoading(false); // re-enable button
      }
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center  bg-green-600 bg-cover bg-no-repeat bg-center">
      <div className="bg-[#fccee84c] backdrop-blur-lg h-[500px] p-11 rounded-xl w-[600px] flex justify-center flex-col gap-10 items-center text-white">
        {step !== 4 && (
          <h1 className="mt-2 text-3xl font-bold text-[#D30C7B] stroke-2 stroke-yellow-500 ">
            ~~~~ Welcome Talkytalk ~~~~{" "}
          </h1>
        )}
        {step !== 4 && (
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
                  maxLength={4}
                  value={formData.otp}
                  placeholder="Enter 4 digit long Otp"
                  onChange={(e) => changeHandler(e)}
                />
              </div>
              <button
                className={`w-24 rounded-lg transition duration-200 bg-blue-600 border-1 otp ${
                  (loading || step === 3
                    ? "cursor-not-allowed"
                    : "cursor-pointer active:scale-75")
                }`}
                onClick={() => {
                  if (step !== 3) {
                    otpHandler();
                  }
                }}
                type="button"
                disabled={loading}
              >
                {loading ? (
                  <Loading />
                ) : step === 1 ? (
                  "Send OTP"
                ) : step === 2 ? (
                  "Verify OTP"
                ) : step === 3 ? (
                  <i className="ri-checkbox-circle-fill text-2xl"></i>
                ) : (
                  ""
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
              className={`bg-[#D30C7B] flex gap-4 py-2 px-6 border-1 transition-opacity duration-300 key
                ${
                  step === 3
                    ? "cursor-pointer opacity-100 active:scale-75"
                    : "cursor-not-allowed opacity-50"
                } 
              `}
              disabled={step !== 3}
              type="submit"
              onClick={() => {
                if (step == 3) {
                  setTimeout(() => {
                    setStep(4);
                  }, 500);
                }
              }}
            >
              Next
              <i className="ri-arrow-right-long-fill"></i>
            </button>
          </form>
        )}
        {step === 4 && (
          <form
            className="w-full h-full  flex justify-center flex-col gap-10 items-center text-white"
            onSubmit={(e) => signinHandler(e)}
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
                <i className="ri-user-shared-line text-[#D30C7B]"></i>
                <input
                  name="firstName"
                  className="appearance-none border-none bg-transparent p-0 m-0 focus:outline-none"
                  type="text"
                  value={formData.firstName}
                  placeholder="First Name"
                  onChange={(e) => changeHandler(e)}
                />
              </div>
              <div className="border-2 border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
                <i className="ri-user-received-line text-[#D30C7B]"></i>
                <input
                  name="lastName"
                  className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                  value={formData.lastName}
                  placeholder="Last Name"
                  onChange={(e) => changeHandler(e)}
                />
              </div>
            </div>
            <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-user-line text-[#D30C7B]"></i>
              <input
                name="username"
                className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
                type="text"
                value={formData.username}
                placeholder="User Name"
                onChange={(e) => changeHandler(e)}
              />
            </div>
            <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
              <i className="ri-quill-pen-ai-fill text-[#D30C7B]"></i>
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
              className="bg-[#D30C7B] w-26 h-12 border-1 flex justify-center text-lg items-center cursor-pointer key active:scale-75"
            >
              {loading ? (
                <Loading />
              ) : (
                <>
                  Sign in &nbsp;<i className="ri-send-plane-fill"></i>
                </>
              )}
            </button>
          </form>
        )}

        <h4 className="">
          <i className="ri-arrow-right-long-fill text-[#D30C7B]"></i>&nbsp;
          Already have an account &nbsp;
          <Link to="/login" className=" font-semibold underline text-[#D30C7B]">
            login here
          </Link>
        </h4>
      </div>
    </div>
  );
};

export default SignUpTwo;
