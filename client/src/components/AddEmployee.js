import React, { useState } from "react";

const AddEmployee = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && team) {
      onAdd({ name, team });
      setName("");
      setTeam("");
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddEmployee;
