import axios from "axios";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import EmployeeCard from "../components/EmployeeCard";
import SearchFilter from "../components/SearchFilter";
import TeamSelector from "../components/TeamSelector";

const AssignTeamPage = ({ employees, teams, refetchEmployees }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const employeesPerPage = 5;
  const offset = currentPage * employeesPerPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((empId) => empId !== id)
        : [...prevSelected, id]
    );
  };

  const assignTeam = async () => {
    if (selectedEmployees.length && newTeam) {
      setIsLoading(true);
      try {
        await axios.put("http://localhost:5000/api/employees/assign-team", {
          employeeIds: selectedEmployees,
          team: newTeam,
        });

        toast.success("Team assigned successfully!");
        setSelectedEmployees([]);
        setNewTeam("");
        refetchEmployees();
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to assign team. Please try again."
        );
        console.log("Assignment error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please select employees and a team");
    }
  };

  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.team.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "name") {
        return a.firstName.localeCompare(b.firstName);
      }
      return a.team.localeCompare(b.team);
    });

  const displayedEmployees = filteredEmployees.slice(
    offset,
    offset + employeesPerPage
  );
  const pageCount = Math.ceil(employees.length / employeesPerPage);

  return (
    <div>
      <h1>Assign Team</h1>
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
        sortType={sortType}
        setSortType={setSortType}
        filteredEmployees={filteredEmployees}
      />
      {selectedEmployees.length > 0 && (
        <div>
          <TeamSelector
            teams={teams}
            newTeam={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            onSubmit={assignTeam}
          />
          <p>{selectedEmployees.length} employee(s) selected</p>
        </div>
      )}
      <div>
        {displayedEmployees.map((employee) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
            isSelected={selectedEmployees.includes(employee._id)}
            onToggle={toggleEmployeeSelection}
          />
        ))}
      </div>
      {isLoading && <p>Assigning team, please wait...</p>}
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
    </div>
  );
};

export default AssignTeamPage;
