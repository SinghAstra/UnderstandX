import { useState } from "react";
import AddEmployee from "./components/AddEmployee";
import AssignTeam from "./components/AssignTeam";
import EmployeeList from "./components/EmployeeList";
import employeeData from "./data/employeeData";

function App() {
  const [employees, setEmployees] = useState(employeeData);

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

  return (
    <div>
      <h1>Employee Management App</h1>
      <AddEmployee onAdd={addEmployee} />
      <EmployeeList employees={employees} onDelete={deleteEmployee} />
      <AssignTeam employees={employees} onUpdate={updateTeam} />
    </div>
  );
}

export default App;
