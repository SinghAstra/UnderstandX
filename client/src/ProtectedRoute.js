// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const useAuthObj = useAuth();
  const user = useAuthObj.user;
  console.log("user is ", user);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
