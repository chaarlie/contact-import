import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        <NavLink className="nav-item " activeClassName="active" to="/welcome">
          <a className="nav-link" href="#">
            Welcome <span className="sr-only">(current)</span>
          </a>
        </NavLink>
        <NavLink className="nav-item" activeClassName="active" to="/contacts">
          <a className="nav-link" href="#">
            Contacts <span className="sr-only">(current)</span>
          </a>
        </NavLink>
        <NavLink
          className="nav-item"
          activeClassName="active"
          to="/failed-contacts"
        >
          <a className="nav-link" href="#">
            Failed Contacts <span className="sr-only">(current)</span>
          </a>
        </NavLink>
        <NavLink
          className="nav-item"
          activeClassName="active"
          to="/processed-files"
        >
          <a className="nav-link" href="#">
            ProcessedFiles <span className="sr-only">(current)</span>
          </a>
        </NavLink>
      </ul>
    </div>
  </nav>
);

export default Navigation;
