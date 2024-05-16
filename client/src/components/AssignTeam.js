import React, { useState } from "react";

const AssignTeam = ({ employees, onUpdate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [newTeam, setNewTeam] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedEmployee && newTeam) {
      onUpdate(selectedEmployee, newTeam);
      setSelectedEmployee("");
      setNewTeam("");
    }
  };

  return (
    <div>
      <h2>Assign Team</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.name}>
              {employee.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Team"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
        />
        <button type="submit">Assign</button>
      </form>
    </div>
  );
};

export default AssignTeam;
