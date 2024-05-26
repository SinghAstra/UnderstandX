import { useFormik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (userData) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await login(userData);
      toast.success("Login successful!");
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    username: "sharmaunique",
    password: "a123ASD@#",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleInputChange = (e) => {
    formik.handleChange(e);
    if (errorMessage) setErrorMessage(null); // Clear error message on input change
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div style={{ color: "red" }}>{formik.errors.username}</div>
          ) : null}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          ) : null}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              onChange={formik.handleChange}
              checked={formik.values.rememberMe}
            />
            Remember Me
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default LoginPage;
