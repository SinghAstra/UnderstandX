import React from "react";

const TeamSelector = ({ teams, newTeam, onChange, onSubmit }) => {
  return (
    <div>
      <select value={newTeam} onChange={onChange}>
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
      <button onClick={onSubmit}>Assign Team</button>
    </div>
  );
};

export default TeamSelector;
