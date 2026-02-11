import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Eye, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const { loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await login({ email, password });
    } catch {
      toast.error("login failed");
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
          <div className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  <LockKeyhole />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  min={4}
                  onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading}
            className={`w-full relative flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-xl transform transition-all active:scale-[0.98] ${"bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200"} disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden group`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Sign Up"
            )}

            <span className="relative z-10">
              {loading ? "Creating Account..." : "Get Started"}
            </span>

            {/* Glossy overlay effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
          </button>

          <p className="text-center text-gray-500 text-sm font-medium pt-2">
            Don't have an account
            <Link
              to={"/signup"}
              className="text-indigo-600 hover:text-indigo-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all"
            >
              Create One
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

export default Login;
