import React from "react";

const EmployeeCard = ({ employee, isSelected, onToggle }) => {
  return (
    <div
      key={employee.id}
      onClick={() => onToggle(employee._id)}
      style={{
        border: isSelected ? "2px solid blue" : "1px solid gray",
        padding: "10px",
        margin: "5px",
        cursor: "pointer",
      }}
    >
      {employee.profilePicture && (
        <img
          src={"http://localhost:5000" + employee.profilePicture}
          alt={employee.name}
          width="50"
          height="50"
        />
      )}
      <h2>
        {employee.firstName} {employee.lastName}
      </h2>
    </div>
  );
};

export default EmployeeCard;
