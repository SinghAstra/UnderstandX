import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  console.log("user is ", user);
  const navigate = useNavigate();
  const login = async (userData) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        userData
      );
      console.log("data --login : " + data);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      console.log(error);
      throw error.response.data.message || "Login failed";
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );
      console.log("response.data in register : ", response.data);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      // if (
      //   error.response &&
      //   error.response.data &&
      //   error.response.data.message
      // ) {
      //   console.log(
      //     "error.response.data.message : ",
      //     error.response.data.message
      //   );
      //   throw error.response.data.message;
      // } else {
      //   console.log("Registration Error : AuthContext", error);
      //   throw new Error("Registration failed. Please try again.");
      // }
      throw error.response.data.message || "Registration failed";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
