import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.log("token doesn't exist");
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }, { withCredentials: true } )
      .then((response) => {
        if (response.status === 200) {
         console.log("token then exist");
        //  console.log(response.data);
          setUser(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("token catch exist");
        console.log(err);
        //localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
