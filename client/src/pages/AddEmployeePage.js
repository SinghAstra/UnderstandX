import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployeePage = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [contactInfo, setContactInfo] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [dateOfHire, setDateOfHire] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = {
      name,
      team,
      profilePicture: profilePicture
        ? URL.createObjectURL(profilePicture)
        : null,
      contactInfo,
      jobTitle,
      dateOfHire,
    };
    onAdd(newEmployee);
    navigate("/");
    setName("");
    setTeam("");
    setProfilePicture(null);
    setContactInfo("");
    setJobTitle("");
    setDateOfHire("");
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
        <input
          type="text"
          placeholder="Contact Information"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date of Hire"
          value={dateOfHire}
          onChange={(e) => setDateOfHire(e.target.value)}
          required
        />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
