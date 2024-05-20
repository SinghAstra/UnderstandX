import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

const EditEmployee = ({ employees, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = employees.find((employee) => employee.id === parseInt(id));
  const [profilePicture, setProfilePicture] = useState(
    employee ? employee.profilePicture : null
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    team: Yup.string().required("Team is required"),
  });

  const initialValues = {
    name: employee ? employee.name : "",
    team: employee ? employee.team : "",
  };

  const handleSubmit = (values) => {
    const updatedEmployee = {
      ...values,
      profilePicture,
    };
    onUpdate(employee.id, updatedEmployee);
    navigate("/");
  };

  const handleFileChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div>
      <h2>Edit Employee</h2>
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
        {profilePicture && (
          <img src={profilePicture} alt="Profile" width="50" height="50" />
        )}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditEmployee;
