import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const EmployeeList = ({ employees, onDelete, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const employeesPerPage = 5;
  const offset = currentPage * employeesPerPage;
  const currentEmployees = employees.slice(offset, offset + employeesPerPage);
  const pageCount = Math.ceil(employees.length / employeesPerPage);

  const handlePageClick = ({ selected }) => {
    console.log("selected ", selected);
    setCurrentPage(selected);
  };

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.team}
            <button onClick={() => onEdit(employee)}>Edit</button>
            <button onClick={() => onDelete(employee.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        onPageChange={handlePageClick}
        pageCount={pageCount}
        pageRangeDisplayed={5}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default EmployeeList;
