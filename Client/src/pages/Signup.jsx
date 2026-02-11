import React, { useState, useRef } from "react";
import {
  Eye,
  EyeOff,
  Camera,
  User,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const App = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await signup(...formData, profileImage);

      setTimeout(() => {
        setIsSuccess(false);
        navigate("/home"); // Uncomment in your project
      }, 1500);
    } catch (error) {
      toast.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 font-sans selection:bg-indigo-100">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-50 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 font-medium">
            Join our community of developers today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group">
              <div
                onClick={triggerFileInput}
                className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-50 cursor-pointer transition-all duration-300 hover:ring-4 hover:ring-indigo-100 group-hover:opacity-90 flex items-center justify-center"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white shadow-lg hover:bg-indigo-700 transition-colors border-2 border-white"
              >
                <Camera size={16} />
              </button>
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Upload Profile Photo
            </span>
          </div>

          <div className="space-y-4">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  min={3}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Sahil Rajput"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-gray-800 font-medium"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="master@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-gray-800 font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Create Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  min={4}
                  onChange={handleChange}
                  placeholder="******"
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-gray-800 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isSuccess}
            className={`w-full relative flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-xl transform transition-all active:scale-[0.98] ${
              isSuccess
                ? "bg-green-500"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200"
            } disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden group`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isSuccess ? (
              <CheckCircle2 size={20} />
            ) : (
              "Sign Up"
            )}

            <span className="relative z-10">
              {loading
                ? "Creating Account..."
                : isSuccess
                  ? "Success!"
                  : "Get Started"}
            </span>

            {/* Glossy overlay effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
          </button>

          <p className="text-center text-gray-500 text-sm font-medium pt-2">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-indigo-600 hover:text-indigo-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>

      <style>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
