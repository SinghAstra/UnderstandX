import React, { useState } from "react";

const EditEmployee = ({ employee, onUpdate }) => {
  const [name, setName] = useState(employee.name);
  const [team, setTeam] = useState(employee.team);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(employee.id, { name, team });
  };

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
