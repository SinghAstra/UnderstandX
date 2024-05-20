import React from "react";
import { toast } from "react-toastify";

const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  sortType,
  setSortType,
  filteredEmployees,
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search employees by name or team"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(0);
          if (e.target.value && !filteredEmployees.length) {
            toast.info("No employees found matching the search criteria.");
          }
        }}
      />
      <select onChange={(e) => setSortType(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="team">Sort by Team</option>
      </select>
    </div>
  );
};

export default SearchFilter;
