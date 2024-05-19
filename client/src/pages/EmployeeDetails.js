import React from "react";
import { useParams } from "react-router-dom";

const EmployeeDetails = ({ employees }) => {
  const { id } = useParams();
  const employee = employees.find((emp) => emp.id === parseInt(id));

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div>
      <h2>Employee Details</h2>
      <p>Name: {employee.name}</p>
      <p>Team: {employee.team}</p>
      <p>ID: {employee.id}</p>
      <a href="/">Back to Employee List</a>
    </div>
  );
};

export default EmployeeDetails;
