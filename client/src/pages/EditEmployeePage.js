import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = ({ employees, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = employees.find((employee) => employee.id === parseInt(id));
  const [name, setName] = useState(employee ? employee.name : "");
  const [team, setTeam] = useState(employee ? employee.team : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(employee.id, { name, team });
    navigate("/");
  };

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditEmployee;
