import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/check-auth"
        );
        console.log("In check auth response.data", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    checkAuth();
  }, [navigate]);

  const login = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userData
      );
      console.log("In login response.data is ", response.data);
      setUser(response.data);
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
      navigate("/");
    } catch (error) {
      throw error.response.data.message || "Registration failed";
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      throw error.response.data.message || "Logout failed";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
