import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        setMessage("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        setMessage(response.data.message);
        toast.success(response.data.message);
      } catch (error) {
        setMessage(error.response.data.message || "Verification failed.");
        toast.error(error.response.data.message || "Verification failed.");
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, [location.search]);

  return (
    <div>
      <h2>Email Verification</h2>
      {loading ? <p>Verifying your email...</p> : <p>{message}</p>}
      {!loading && <Link to="/login">Go to Login</Link>}
    </div>
  );
};

export default VerifyEmailPage;
