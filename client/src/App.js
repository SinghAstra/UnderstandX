import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import employeeData from "./data/employeeData";
import EditEmployeePage from "./pages/EditEmployeePage";
import EmployeeDetails from "./pages/EmployeeDetails";
import HomePage from "./pages/HomePage";

function App() {
  const [employees, setEmployees] = useState(employeeData);
  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === id ? { ...employee, ...updatedEmployee } : employee
      )
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage employees={employees} setEmployees={setEmployees} />}
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
    </Routes>
  );
}

export default App;
