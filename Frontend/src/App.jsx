import React, { lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import UserProtectedWrapper from "./protectedWrapper/UserProtectedWrapper";
import axios from "axios";
import Signup from "./pages/Signup";
const VideoComponent = lazy(() => import("./pages/VideoComponent"));
const Call = lazy(() => import("./pages/Call"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Landing = lazy(() => import("./pages/LandingPage"));
const Payment = lazy(() => import("./pages/Payment"));

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);


  
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <UserProtectedWrapper>
            <Home />
          </UserProtectedWrapper>
        }
      />
      <Route
        path="/profile"
        element={
          <UserProtectedWrapper>
            <Profile />
          </UserProtectedWrapper>
        }
      />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/payment" element={<Payment />} /> */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/call" element={<Call />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
