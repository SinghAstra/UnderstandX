import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const AddEmployeePage = ({ onAdd }) => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    team: Yup.string().required("Team is required"),
    contactInfo: Yup.string().required("Contact information is required"),
    jobTitle: Yup.string().required("Job title is required"),
    dateOfHire: Yup.date().required("Date of hire is required").nullable(),
  });

  const initialValues = {
    name: "",
    team: "",
    profilePicture: null,
    contactInfo: "",
    jobTitle: "",
    dateOfHire: "",
  };

  const handleSubmit = (values) => {
    const newEmployee = {
      ...values,
      profilePicture: profilePicture
        ? URL.createObjectURL(profilePicture)
        : null,
    };
    console.log("newEmployee: " + newEmployee);
    onAdd(newEmployee);
    navigate("/");
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
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <div style={{ color: "red" }}>{formik.errors.name}</div>
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
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <input
            type="text"
            placeholder="Contact Information"
            name="contactInfo"
            value={formik.values.contactInfo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.contactInfo && formik.errors.contactInfo ? (
            <div style={{ color: "red" }}>{formik.errors.contactInfo}</div>
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
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
