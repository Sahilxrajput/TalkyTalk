import { useContext } from "react";
import UserDataContext from "../context/UserContext";

const useAuth = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
