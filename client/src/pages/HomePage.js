import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import AssignTeam from "../components/AssignTeam";
import EmployeeList from "../components/EmployeeList";

const HomePage = ({ employees, setEmployees }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [currentPage, setCurrentPage] = useState(0);

  const employeesPerPage = 5;
  const offset = currentPage * employeesPerPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const updateTeam = (employeeName, newTeam) => {
    setEmployees(
      employees.map((employee) =>
        employee.name === employeeName
          ? { ...employee, team: newTeam }
          : employee
      )
    );
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.team.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.team.localeCompare(b.team);
    });

  const pageCount = Math.ceil(filteredEmployees.length / employeesPerPage);
  return (
    <div>
      <h1>Employee Management App</h1>
      <input
        type="text"
        placeholder="Search employees by name or team"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(0);
        }}
      />
      <select onChange={(e) => setSortType(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="team">Sort by Team</option>
      </select>
      <EmployeeList
        employees={filteredEmployees.slice(offset, offset + employeesPerPage)}
        onDelete={deleteEmployee}
        currentPage={currentPage}
      />
      <AssignTeam employees={employees} onUpdate={updateTeam} />
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        onPageChange={handlePageClick}
        pageCount={pageCount}
        pageRangeDisplayed={5}
        containerClassName={"pagination"}
        activeClassName={"active"}
        forcePage={currentPage}
      />
    </div>
  );
};

export default HomePage;
