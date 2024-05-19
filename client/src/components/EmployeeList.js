import React from "react";
import { useNavigate } from "react-router-dom";

const EmployeeList = ({ employees, onDelete, currentPage }) => {
  const navigate = useNavigate();

  const handleEdit = (employee) => {
    navigate(`/edit/${employee.id}`);
  };

  const handleDetails = (employee) => {
    navigate(`/details/${employee.id}`);
  };

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.profilePicture && (
              <img
                src={employee.profilePicture}
                alt={employee.name}
                width="50"
                height="50"
              />
            )}
            <span
              onClick={() => handleDetails(employee)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              {employee.name} - {employee.team}
            </span>
            <button onClick={() => handleEdit(employee)}>Edit</button>
            <button onClick={() => onDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
