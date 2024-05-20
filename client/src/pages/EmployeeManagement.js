import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import EmployeeList from "../components/EmployeeList";
import SearchFilter from "../components/SearchFilter";

const EmployeeManagement = ({ employees, setEmployees }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const employeesPerPage = 5;
  const offset = currentPage * employeesPerPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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

  const handleDeleteClick = (id) => {
    const employee = employees.find((employee) => employee.id === id);
    setEmployeeToDelete(employee);
    setDeleteModalIsOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!employeeToDelete) {
      return;
    }
    setEmployees(
      employees.filter((employee) => employee.id !== employeeToDelete.id)
    );
    setDeleteModalIsOpen(false);
    toast.error("Employee deleted successfully!");
  };

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
        onDelete={handleDeleteClick}
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
      <ConfirmationModal
        isOpen={deleteModalIsOpen}
        closeModal={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${employeeToDelete?.name}?`}
      />
    </div>
  );
};

export default EmployeeManagement;
