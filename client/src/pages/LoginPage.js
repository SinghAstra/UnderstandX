import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [role, setRole] = useState("admin");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await login({ role });
      navigate("/");
    } catch (error) {
      setError("Failed to log in. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div>Error: {error}</div>}
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
