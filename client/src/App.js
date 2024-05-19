import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import employeeData from "./data/employeeData";
import AddEmployeePage from "./pages/AddEmployeePage";
import EditEmployeePage from "./pages/EditEmployeePage";
import EmployeeDetails from "./pages/EmployeeDetails";
import HomePage from "./pages/HomePage";

function App() {
  const [employees, setEmployees] = useState(employeeData);

  console.log("employees is ", employees);
  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === id ? { ...employee, ...updatedEmployee } : employee
      )
    );
  };

  const addEmployee = (employee) => {
    setEmployees([{ ...employee, id: employees.length + 1 }, ...employees]);
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage employees={employees} setEmployees={setEmployees} />
          }
        />
        <Route
          path="/details/:id"
          element={<EmployeeDetails employees={employees} />}
        />
        <Route
          path="/edit/:id"
          element={
            <EditEmployeePage employees={employees} onUpdate={updateEmployee} />
          }
        />
        <Route path="/add" element={<AddEmployeePage onAdd={addEmployee} />} />
      </Routes>
    </div>
  );
}

export default App;
