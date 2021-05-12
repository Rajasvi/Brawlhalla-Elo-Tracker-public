import React from "react";
import { Link, withRouter } from "react-router-dom";


function Navigation(props) {
  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-esportsblue">
        <div class="container">
          <Link class="navbar-brand" to="/">
            Brawlhalla Elo Tracker
          </Link>

          <div>
            <ul class="navbar-nav ml-auto">
              <li key="home"
                class={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/">
                  Home
                  <span class="sr-only">(current)</span>
                </Link>
              </li>
              <li key="about"
                class={`nav-item  ${
                  props.location.pathname === "/about" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li key="add"
                class={`nav-item  ${
                  props.location.pathname === "/add" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/add">
                  Add Tracker
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(Navigation);