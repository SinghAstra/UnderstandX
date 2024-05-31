import axios from "axios";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import EmployeeList from "../components/EmployeeList";
import SearchFilter from "../components/SearchFilter";

const EmployeeManagement = ({ employees, refetchEmployees }) => {
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
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.team.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "name") {
        return a.firstName.localeCompare(b.firstName);
      }
      return a.team.localeCompare(b.team);
    });

  const handleDeleteClick = (id) => {
    const employee = employees.find((employee) => employee._id === id);
    setEmployeeToDelete(employee);
    setDeleteModalIsOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };
  const handleConfirmDelete = async () => {
    console.log("handleCONFIRMDELETE is called");
    if (!employeeToDelete) {
      setDeleteModalIsOpen(false);
      return;
    }
    try {
      await axios.delete(
        `http://localhost:5000/api/employees/${employeeToDelete._id}`
      );
      setDeleteModalIsOpen(false);
      toast.success("Employee deleted successfully!");
      refetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee. Please try again.");
      console.log("Error deleting employee:", error);
    }
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
        message={`Are you sure you want to delete ${employeeToDelete?.firstName} ${employeeToDelete?.lastName}?`}
      />
    </div>
  );
};

export default EmployeeManagement;
