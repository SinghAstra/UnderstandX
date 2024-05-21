import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/manage">Employee Management</Link>
        </li>
        <li>
          <Link to="/add">Add Employee</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/assign-team">Assign Team</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
