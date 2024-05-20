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
    try {
      generateCSV(csvHeader, employees, "employees");
      toast.success("Employee data exported to CSV successfully!");
    } catch (error) {
      toast.error("Failed to export employee data to CSV. Please try again.");
      console.error("Export error:", error);
    }
  };

  return (
    <div>
      <h1>Export Employee Data</h1>
      <button onClick={handleExport}>Export to CSV</button>
    </div>
  );
};

export default ExportPage;
