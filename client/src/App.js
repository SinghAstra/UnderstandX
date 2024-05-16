import { useState } from "react";
import AddEmployee from "./components/AddEmployee";
import EmployeeList from "./components/EmployeeList";
import employeeData from "./data/employeeData";

function App() {
  const [employees, setEmployees] = useState(employeeData);

  const addEmployee = (employee) => {
    setEmployees([{ ...employee, id: employees.length + 1 }, ...employees]);
  };

  return (
    <div>
      <h1>Employee Management App</h1>
      <AddEmployee onAdd={addEmployee} />
      <EmployeeList employees={employees} />
    </div>
  );
}

export default App;
