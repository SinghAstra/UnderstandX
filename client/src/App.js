import { useState } from "react";
import EmployeeList from "./components/EmployeeList";
import employeeData from "./data/employeeData";

function App() {
  const [employees, setEmployees] = useState(employeeData);

  return (
    <div>
      <h1>Employee Management App</h1>
      <EmployeeList employees={employees} />
    </div>
  );
}

export default App;
