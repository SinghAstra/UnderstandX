import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = ({ employees, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = employees.find((employee) => employee.id === parseInt(id));
  const [name, setName] = useState(employee ? employee.name : "");
  const [team, setTeam] = useState(employee ? employee.team : "");
  const [profilePicture, setProfilePicture] = useState(
    employee ? employee.profilePicture : null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEmployee = {
      name,
      team,
      profilePicture,
    };
    onUpdate(employee.id, updatedEmployee);
    navigate("/");
  };

  const handleFileChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
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
          required
        />
        <input
          type="text"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          required
        />
        <input type="file" onChange={handleFileChange} />
        {profilePicture && (
          <img src={profilePicture} alt="Profile" width="50" height="50" />
        )}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditEmployee;
