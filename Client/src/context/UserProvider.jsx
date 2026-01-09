import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import UserDataContext from "./UserContext";

// Create a provider component
const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
          withCredentials: true,
        }
      );
    //   console.log("user : ", data);
      setUser(data);
    } catch (err) {
      console.error("Failed to refresh user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserDataContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
