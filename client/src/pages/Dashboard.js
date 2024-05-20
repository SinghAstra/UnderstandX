import React from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ employees }) => {
  const totalEmployees = employees.length;
  const totalTeams = [...new Set(employees.map((emp) => emp.team))].length;
  const averageTenure = (
    employees.reduce(
      (total, emp) =>
        total +
        (new Date().getFullYear() - new Date(emp.dateOfHire).getFullYear()),
      0
    ) / totalEmployees
  ).toFixed(2);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h2>Total Employees</h2>
          <p>{totalEmployees}</p>
        </div>
        <div className="card">
          <h2>Total Teams</h2>
          <p>{totalTeams}</p>
        </div>
        <div className="card">
          <h2>Average Tenure (Years)</h2>
          <p>{averageTenure}</p>
        </div>
      </div>
      <div className="dashboard-actions">
        <Link to="/manage" className="btn">
          Manage Employees
        </Link>
        <Link to="/export" className="btn">
          Export Data
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
