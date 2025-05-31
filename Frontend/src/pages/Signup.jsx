import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/5825558.jpg";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);
  const [otp, setOtp] = useState("");
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    url: "",
    filename: "",
    age: "",
    gender: "male", // default
    bio: "Available",
  });

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("image", file); //  real file

    // Append all fields from formData
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    formDataToSend.append("otp", otp); // append OTP separately

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

      console.log(`otp ${otp}`);
      console.log("Signup successful:", response.data);

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

      // Reset form state
      setOtp("");
      setFile(null);
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        age: "",
        gender: "male",
        bio: "Available",
      });
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
    }
  };

  const getOtpHandler = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/getotp`,
      { withCredentials: true },
      { to: formData.email }
    );
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <form
        className="bg-[#fccee84c] backdrop-blur-lg h-[680px] p-11 rounded-xl w-[600px] flex justify-center flex-col gap-10 items-center text-white"
        onSubmit={(e) => submitHandler(e)}
      >
        <h1 className="mt-2 text-3xl font-bold text-[#D30C7B] stroke-2 stroke-yellow-500 ">
          ~~~~ Welcome Talkytalk ~~~~{" "}
        </h1>
        <div className=" flex items-center justify-between gap-12">
          <div className="border-2 border-yellow-500 flex items-center justify-between gap-1 px-3 p-2 rounded-lg">
            <i className="ri-user-shared-line text-[#D30C7B]"></i>
            <input
              className="appearance-none border-none bg-transparent p-0 m-0 focus:outline-none"
              type="text"
              value={formData.firstName}
              name="firstName"
              placeholder="Firstname"
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className="border-2 border-yellow-500  flex items-center justify-between gap-2 px-3 p-2 rounded-lg">
            <i className="ri-user-received-line text-[#D30C7B]"></i>
            <input
              name="lastName"
              className="appearance-none border-none  bg-transparent p-0 m-0 focus:outline-none"
              type="text"
              value={formData.lastName}
              placeholder="Lastname"
              onChange={(e) => changeHandler(e)}
            />
          </div>
        </div>
        <div className="border-2 w-full border-yellow-500 flex items-center  justify-start  gap-2 px-3 p-2 rounded-lg">
          <i className="ri-user-line text-[#D30C7B]"></i>
          <input
            name="username"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            value={formData.username}
            placeholder="Username"
            onChange={(e) => changeHandler(e)}
          />
        </div>
        <div className=" flex items-center justify-between  w-full">
          <div className="border-2 w-2/4 border-yellow-500 flex items-center justify-start  gap-2 px-3 p-2 rounded-lg">
            <i className="ri-mail-ai-line text-[#D30C7B]"></i>
            <input
              name="email"
              className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
              type="email"
              value={formData.email}
              placeholder="Email"
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className="border-2 w-1/4  border-yellow-500 flex items-center justify-start  gap-2 px-3 p-2 rounded-lg">
            {/* <i className="ri-mail-ai-line text-[#D30C7B]"></i> */}
            <input
              name="email"
              className="appearance-none border-none w-full bg-transparent p-0 m-0 focus:outline-none"
              type="text"
              value={otp}
              placeholder="OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={getOtpHandler}
            className="bg-blue-800 rounded-lg text-sm p-2"
          >
            Get OTP
          </button>
        </div>
        <div className=" flex items-center justify-between gap-12">
          <div className="border-2 w-1/2 border-yellow-500 flex items-center justify-start gap-2 px-3 p-2 rounded-lg">
            <i className="ri-lock-2-line text-[#D30C7B]"></i>
            <input
              name="password"
              className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="Password"
              onChange={(e) => changeHandler(e)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <i
                className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
              ></i>{" "}
            </button>
          </div>
          <div className="border-2 w-1/2 border-yellow-500 flex items-center justify-start gap-2 px-3 p-2 rounded-lg">
            <i className="ri-lock-unlock-line text-[#D30C7B]"></i>
            <input
              name="confirmPassword"
              className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
              value={formData.confirmpassword}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => changeHandler(e)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <i
                className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
              ></i>{" "}
            </button>
          </div>
        </div>
        <div className=" flex items-center justify-between gap-28">
          <div className="border-2 w-1/4 border-yellow-500 flex items-center justify-start gap-2 px-3 p-2 rounded-lg">
            <i className="ri-calendar-line text-[#D30C7B]"></i>
            <input
              name="age"
              className="appearance-none border-none  bg-transparent p-0 m-0 focus:outline-none"
              placeholder="Age"
              value={formData.age}
              type="text"
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <select
            className="border-2 w-1/2  border-yellow-500 flex items-center justify-start gap-2 px-3 p-2  rounded-lg  focus:border-blue-500 "
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) => changeHandler(e)}
          >
            <option
              className="text-white font-semibold  bg-[#222222]"
              value="male"
            >
              Male
            </option>
            <option
              className="text-white font-semibold bg-[#222222]"
              value="female"
            >
              Female
            </option>
            <option
              className="text-white font-semibold bg-[#222222]"
              value="other"
            >
              Other
            </option>
            <option
              className="text-white font-semibold bg-[#222222]"
              value="prefer not to say"
            >
              Prefer not to say
            </option>
          </select>
        </div>
        <div className="border-2 w-full border-yellow-500 flex items-center justify-start gap-2 px-3 p-2 rounded-lg">
          <i className="ri-quill-pen-ai-fill text-[#D30C7B]  border-r-2 h-full rounded-full flex items-center text-2xl p-2 border-yellow-500"></i>
          <input
            className="  h-18  appearance-none text-start text-lg w-full bg-transparent px-3 p-2 rounded-lg m-0 focus:outline-none"
            type="text"
            name="bio"
            value={formData.bio}
            placeholder="Bio"
            onChange={(e) => changeHandler(e)}
          />
        </div>
        <div className="flex">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" width="50" />}
        </div>
        <button
          className="bg-[#D30C7B] py-2 px-4 rounded-lg -mt-4"
          type="submit"
        >
          Sign in <i className="ri-send-plane-fill"></i>
        </button>
        <h4 className="-mt-8">
          <i className="ri-arrow-right-long-fill text-[#D30C7B]"></i>&nbsp;
          Already has a account &nbsp;{" "}
          <Link to="/login" className=" font-semibold underline text-[#D30C7B]">
            login here
          </Link>
        </h4>
      </form>
    </div>
  );
};

export default Signup;
