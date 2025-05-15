import React, { lazy, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import UserProtectedWrapper from "./protectedWrapper/UserProtectedWrapper";
import axios from "axios";
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));

const App = () => {

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }, []);
    

  return (
    <Routes>
      <Route path="/home" element={
        <UserProtectedWrapper>
        <Home />
        </UserProtectedWrapper>
        } />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/profile"
        element={
          <UserProtectedWrapper>
            <Profile />
          </UserProtectedWrapper>
        }
      />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default App;
