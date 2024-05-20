import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import employeeData from "./data/employeeData";
import AddEmployeePage from "./pages/AddEmployeePage";
import AssignTeamPage from "./pages/AssignTeamPage";
import Dashboard from "./pages/Dashboard";
import EditEmployeePage from "./pages/EditEmployeePage";
import EmployeeDetails from "./pages/EmployeeDetails";
import EmployeeManagement from "./pages/EmployeeManagement";
import ExportPage from "./pages/ExportPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [employees, setEmployees] = useState(employeeData);

  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === id ? { ...employee, ...updatedEmployee } : employee
      )
    );
    toast.success("Team updated successfully!");
  };

  const addEmployee = (employee) => {
    setEmployees([{ ...employee, id: employees.length + 1 }, ...employees]);
    toast.success("Employee added successfully!");
  };

  const getUniqueTeams = (employees) => {
    const teams = employees.map((employee) => employee.team);
    const uniqueTeams = [...new Set(teams)];
    return uniqueTeams;
  };

  const teams = getUniqueTeams(employees);

  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard employees={employees} />} />
          <Route
            path="/manage"
            element={
              <EmployeeManagement
                employees={employees}
                setEmployees={setEmployees}
              />
            }
          />
          <Route
            path="/details/:id"
            element={<EmployeeDetails employees={employees} />}
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute roles={["admin", "manager"]}>
                <EditEmployeePage
                  employees={employees}
                  onUpdate={updateEmployee}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AddEmployeePage onAdd={addEmployee} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/export"
            element={<ExportPage employees={employees} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/assign-team"
            element={
              <ProtectedRoute roles={["admin", "manager"]}>
                <AssignTeamPage
                  employees={employees}
                  setEmployees={setEmployees}
                  teams={teams}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
