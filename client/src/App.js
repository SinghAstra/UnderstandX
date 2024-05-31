import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data.employees);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to fetch employees. Please try again.";
      toast.error(errorMsg);
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  console.log("employees is ", employees);

  const getUniqueTeams = (employees) => {
    const teams = employees.map((employee) => employee.team);
    const uniqueTeams = [...new Set(teams)];
    return uniqueTeams;
  };

  const teams = getUniqueTeams(employees);

  if (loading) {
    return <div>Loading...</div>;
  }

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
                  refetchEmployees={fetchEmployees}
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
                  refetchEmployees={fetchEmployees}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddEmployeePage refetchEmployees={fetchEmployees} />
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
                  refetchEmployees={fetchEmployees}
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
