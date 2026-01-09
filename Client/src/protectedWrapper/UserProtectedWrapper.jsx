import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";

const UserProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center h-screen w-screen items-center">
        Loading <Loading bg={"bg-red-500"} />
      </div>
    );
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
