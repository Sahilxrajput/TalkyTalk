import React, { lazy, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import UserProtectedWrapper from "./protectedWrapper/UserProtectedWrapper";
import axios from "axios";
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));

const App = () => {
  //   const [message, setMessage] = useState('');
  //   const [chat, setChat] = useState([]);

    // const socket = io('http://localhost:5000', {
    //   transports: ['websocket'],
    //   withCredentials: true,
    // });
 

    // useEffect(() => {

    //   socket.on('connect', () => {
    //     console.log(`Connected to socket server with id: ${socket.id}`);
    //   });

    //   socket.on('Welcome', (data) => {
    //     console.log(data);
    //   });

    //   socket.on('chat', (payload) => {
    //     setChat([...chat, payload]);
    //     console.log(payload);
    //   })

    //   socket.on('disconnect', () => {
    //     console.log('Disconnected from socket server');
    //   }
    //   );

    // }, [])
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
