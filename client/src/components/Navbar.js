import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logOut } = useAuth();
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/manage">Employee Management</Link>
            </li>
            <li>
              <Link to="/add">Add Employee</Link>
            </li>
            <li>
              <Link to="/assign-team">Assign Team</Link>
            </li>
            {/* <li>
              <button onClick={logout}>Logout</button>
            </li> */}
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
