import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import EmployeeList from "../components/EmployeeList";
import SearchFilter from "../components/SearchFilter";

const EmployeeManagement = ({ employees, setEmployees }) => {
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
    toast.success("Team updated successfully!");
  };

  const deleteEmployee = (id) => {
    if (!employees.find((employee) => employee.id === id)) {
      toast.error("Employee not found!");
      return;
    }
    setEmployees(employees.filter((employee) => employee.id !== id));
    toast.error("Employee deleted successfully!");
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
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
        sortType={sortType}
        setSortType={setSortType}
        filteredEmployees={filteredEmployees}
      />
      <EmployeeList
        employees={filteredEmployees.slice(offset, offset + employeesPerPage)}
        onDelete={deleteEmployee}
        currentPage={currentPage}
      />
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

export default EmployeeManagement;
