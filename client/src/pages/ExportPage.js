import React from "react";
import { toast } from "react-toastify";
import { generateCSV } from "../utils/csvUtils";

const ExportPage = ({ employees }) => {
  const csvHeader = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Team", key: "team" },
    { label: "Job Title", key: "jobTitle" },
    { label: "Contact Info", key: "contactInfo" },
    { label: "Date of Hire", key: "dateOfHire" },
    { label: "Profile Picture", key: "profilePicture" },
  ];

  const handleExport = () => {
    generateCSV(csvHeader, employees, "employees");
    toast.success("Employee data exported to CSV successfully!");
  };

  return (
    <div>
      <h1>Export Employee Data</h1>
      <button onClick={handleExport}>Export to CSV</button>
    </div>
  );
};

export default ExportPage;
