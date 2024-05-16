import { useState } from "react";
import ReactPaginate from "react-paginate";
import AddEmployee from "./components/AddEmployee";
import AssignTeam from "./components/AssignTeam";
import EditEmployee from "./components/EditEmployee";
import EmployeeList from "./components/EmployeeList";
import employeeData from "./data/employeeData";

function App() {
  const [employees, setEmployees] = useState(employeeData);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const employeesPerPage = 5;
  const offset = currentPage * employeesPerPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const addEmployee = (employee) => {
    setEmployees([{ ...employee, id: employees.length + 1 }, ...employees]);
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

  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === id ? { ...employee, ...updatedEmployee } : employee
      )
    );
    setEditingEmployee(null);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredEmployees.length / employeesPerPage);

  console.log("pageCount is ", pageCount);
  console.log("current page is ", currentPage);

  return (
    <div>
      <h1>Employee Management App</h1>
      {editingEmployee ? (
        <EditEmployee employee={editingEmployee} onUpdate={updateEmployee} />
      ) : (
        <>
          <input
            type="text"
            placeholder="Search employees by name or team"
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(0);
              setSearchTerm(e.target.value);
            }}
          />
          <AddEmployee onAdd={addEmployee} />
          <EmployeeList
            employees={filteredEmployees.slice(
              offset,
              offset + employeesPerPage
            )}
            onDelete={deleteEmployee}
            onEdit={setEditingEmployee}
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
        </>
      )}
    </div>
  );
}

export default App;
