import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
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
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

function App() {
  const [employees, setEmployees] = useState(employeeData);

  const updateEmployee = (id, updatedEmployee) => {
    try {
      setEmployees(
        employees.map((employee) =>
          employee.id === id ? { ...employee, ...updatedEmployee } : employee
        )
      );
      toast.success("Team updated successfully!");
    } catch (error) {
      toast.error("Failed to update team. Please try again.");
      console.error("Update error:", error);
    }
  };

  const addEmployee = (employee) => {
    try {
      setEmployees([{ ...employee, id: employees.length + 1 }, ...employees]);
      toast.success("Employee added successfully!");
    } catch (error) {
      toast.error("Failed to add employee. Please try again.");
      console.error("Add employee error:", error);
    }
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
              <PrivateRoute>
                <EmployeeManagement
                  employees={employees}
                  setEmployees={setEmployees}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/details/:id"
            element={
              <PrivateRoute>
                <EmployeeDetails employees={employees} />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditEmployeePage
                  employees={employees}
                  onUpdate={updateEmployee}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddEmployeePage onAdd={addEmployee} />
              </PrivateRoute>
            }
          />
          <Route
            path="/export"
            element={
              <PrivateRoute>
                <ExportPage employees={employees} />
              </PrivateRoute>
            }
          />
          <Route
            path="/assign-team"
            element={
              <PrivateRoute>
                <AssignTeamPage
                  employees={employees}
                  setEmployees={setEmployees}
                  teams={teams}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmailPage />
              </PublicRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
