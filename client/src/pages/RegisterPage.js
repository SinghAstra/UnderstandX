import { useFormik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    username: "sharmaunique",
    password: "a123ASD@#",
    confirmPassword: "a123ASD@#",
    firstName: "firstName",
    lastName: "lastName",
    email: "singhisabhaypratap@gmail.com",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is  required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    firstName: Yup.string()
      .required("First Name is required")
      .matches(/^[a-zA-Z]+$/, "First Name must contain only letters")
      .min(2, "First Name must be at least 2 characters")
      .max(50, "First Name must be less than 50 characters"),
    lastName: Yup.string()
      .required("Last Name is required")
      .matches(/^[a-zA-Z]+$/, "Last Name must contain only letters")
      .min(2, "Last Name must be at least 2 characters")
      .max(50, "Last Name must be less than 50 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await register(values);
      toast.success(
        "Registration successful! Please check your email for verification."
      );
    } catch (error) {
      setError(error);
      console.log("Registration error : Register Page ", error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div>
      <h2>Register</h2>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            onChange={formik.handleChange}
            value={formik.values.username}
            onBlur={formik.handleBlur}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div style={{ color: "red" }}>{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            onChange={formik.handleChange}
            value={formik.values.firstName}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div style={{ color: "red" }}>{formik.errors.firstName}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            onChange={formik.handleChange}
            value={formik.values.lastName}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div style={{ color: "red" }}>{formik.errors.lastName}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={{ color: "red" }}>{formik.errors.email}</div>
          ) : null}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
