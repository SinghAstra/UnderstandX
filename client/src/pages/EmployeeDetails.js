import React from "react";
import { Link, useParams } from "react-router-dom";

const EmployeeDetails = ({ employees }) => {
  const { id } = useParams();
  const employee = employees.find((emp) => emp._id === parseInt(id));

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div>
      <h2>Employee Details</h2>
      {employee.profilePicture && (
        <img
          src={employee.profilePicture}
          alt={employee.name}
          width="100"
          height="100"
        />
      )}
      <p>Name: {employee.name}</p>
      <p>Team: {employee.team}</p>
      <p>Contact Information: {employee.contactInfo}</p>
      <p>Job Title: {employee.jobTitle}</p>
      <p>Date of Hire: {employee.dateOfHire}</p>
      <p>ID: {employee.id}</p>
      <Link to="/">Back to Employee List</Link>
    </div>
  );
};

export default EmployeeDetails;
