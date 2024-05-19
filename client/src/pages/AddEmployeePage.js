import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployeePage = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = {
      name,
      team,
      profilePicture: profilePicture
        ? URL.createObjectURL(profilePicture)
        : null,
    };
    onAdd(newEmployee);
    navigate("/");
    setName("");
    setTeam("");
    setProfilePicture(null);
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
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
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
