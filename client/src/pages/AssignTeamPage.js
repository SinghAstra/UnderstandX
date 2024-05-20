import React, { useState } from "react";
import { toast } from "react-toastify";

const AssignTeamPage = ({ employees, setEmployees }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [newTeam, setNewTeam] = useState("");

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((empId) => empId !== id)
        : [...prevSelected, id]
    );
  };

  const assignTeam = () => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        selectedEmployees.includes(employee.id)
          ? { ...employee, team: newTeam }
          : employee
      )
    );
    toast.success("Team assigned successfully!");
    setSelectedEmployees([]);
    setNewTeam("");
  };

  return (
    <div>
      <h1>Assign Team</h1>
      {selectedEmployees.length > 0 && (
        <div>
          <input
            type="text"
            placeholder="New Team"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
          />
          <button onClick={assignTeam}>Assign Team</button>
        </div>
      )}
      <div>
        {employees.map((employee) => (
          <div
            key={employee.id}
            onClick={() => toggleEmployeeSelection(employee.id)}
            style={{
              border: selectedEmployees.includes(employee.id)
                ? "2px solid blue"
                : "1px solid gray",
              padding: "10px",
              margin: "5px",
              cursor: "pointer",
            }}
          >
            {employee.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignTeamPage;
