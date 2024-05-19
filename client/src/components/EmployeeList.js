import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeList = ({ employees, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <span
              onClick={() => navigate(`/details/${employee.id}`)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              {employee.name} - {employee.team}
            </span>
            <button onClick={() => handleEdit(employee.id)}>Edit</button>
            <button onClick={() => onDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
