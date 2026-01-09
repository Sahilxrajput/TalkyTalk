import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { API } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Signup = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const submitHandler = async () => {
    if (!email || !password || !firstName) {
      toast.error("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/users/signup", {
        firstName,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      await refreshUser();

      toast.success("Account created successfully");
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-75 ease-in p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Join us and start building cool stuff
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">First Name</label>
            <input
              type="text"
              value={firstName}
              placeholder="Your name"
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative flex items-center justify-between rounded-xl border border-gray-300 group gap-2 px-4 py-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className=" w-full border-none outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className=" text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={submitHandler}
            disabled={loading}
            className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
