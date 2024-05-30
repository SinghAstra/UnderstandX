import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required.")
      .matches(
        /^[A-Za-z]+$/,
        "First name must contain only alphabetic characters."
      ),
    lastName: Yup.string()
      .required("Last name is required.")
      .matches(
        /^[A-Za-z\s]+$/,
        "Last name must contain only alphabetic characters and spaces."
      ),
    email: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid email address."),
    phoneNumber: Yup.string()
      .required("Phone number is required.")
      .matches(/^[0-9]+$/, "Phone number must contain only digits."),
    jobTitle: Yup.string().required("Job title is required."),
    team: Yup.string().required("Team is required."),
    dateOfHire: Yup.date()
      .required("Date of hire is required.")
      .typeError("Date of hire must be a valid date."),
  });

  const initialValues = {
    firstName: "firstName",
    lastName: "lastName",
    email: "email@firstname.com",
    phoneNumber: "6387661992",
    jobTitle: "jobtitle",
    team: "team",
    dateOfHire: "13-04-2003",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key]);
    }

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/employees/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Employee added successfully!");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Failed to add employee. Please try again."
      );
      console.log("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 5 * 1024 * 1024
    ) {
      setProfilePicture(file);
    } else {
      alert("Please upload a valid image file (max size 5MB)");
    }
  };
  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div style={{ color: "red" }}>{formik.errors.firstName}</div>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div style={{ color: "red" }}>{formik.errors.lastName}</div>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={{ color: "red" }}>{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div style={{ color: "red" }}>{formik.errors.phoneNumber}</div>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            placeholder="Job Title"
            name="jobTitle"
            value={formik.values.jobTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.jobTitle && formik.errors.jobTitle ? (
            <div style={{ color: "red" }}>{formik.errors.jobTitle}</div>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            placeholder="Team"
            name="team"
            value={formik.values.team}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.team && formik.errors.team ? (
            <div style={{ color: "red" }}>{formik.errors.team}</div>
          ) : null}
        </div>
        <div>
          <input
            type="date"
            placeholder="Date of Hire"
            name="dateOfHire"
            value={formik.values.dateOfHire}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.dateOfHire && formik.errors.dateOfHire ? (
            <div style={{ color: "red" }}>{formik.errors.dateOfHire}</div>
          ) : null}
        </div>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
