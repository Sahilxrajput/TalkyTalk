import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import UserDataContext from "./UserContext";
import notifyError from "../lib/notifyError";
import { API } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Create a provider component
const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API("/users/profile");
      setUser(data);
    } catch (err) {
      notifyError(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        const { data } = await API.post("/users/signup", payload);
        localStorage.setItem("token", data.token);

        setUser(data.user);
        toast.success(data.message);
        navigate("home");
      } catch (e) {
        notifyError(e);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const login = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        const { data } = await API.post("/users/login", payload);
        localStorage.setItem("token", data.token);

        setUser(data.user);
        toast.success(data.message);
        navigate("home");
      } catch (e) {
        notifyError(e);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

    useEffect(() => {
      refreshUser();
    }, [refreshUser]);

  return (
    <UserDataContext.Provider
      value={{ user, loading, refreshUser, signup, login }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
