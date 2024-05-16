import React from "react";

const EmployeeList = ({ employees }) => {
  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.team}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
