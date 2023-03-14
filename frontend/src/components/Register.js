import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Notification from "./Notification";

const Welcome = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);

  const clearFields = () => {
    setUsername("");
    setPassword("");
    setError(null);
    setServerResponse(null);
  };
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const data = { username, password };
    if (username && password) {
      try {
        const response = await axios.post("/user", data);
        setServerResponse(response);
      } catch (error) {
        setError({
          message: error.response.data.message,
          status: error.response.data.statusCode,
        });
      }
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="col-6">
        <h3 className="text-center">Sign Up </h3>
        <form onSubmit={handleRegisterSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email address or Username</label>
            <input
              onChange={(e) => {
                clearFields();

                setUsername(e.target.value);
              }}
              id="username"
              name="username"
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <button
              name="submit"
              type="submit"
              className="btn btn-primary form-control"
            >
              Register
            </button>
          </div>
        </form>
        <div>
          <Link to="/login">
            <button type="button" class="btn btn-link">
              Login
            </button>
          </Link>
        </div>

        <>
          {!!error && (
            <Notification
              message={error.message}
              statusCode={error.status}
              type="alert-danger"
            />
          )}

          {!!serverResponse && (
            <Notification
              message={"user created"}
              statusCode={201}
              type="alert-success"
            />
          )}
        </>
      </div>
    </div>
  );
};

export default Welcome;
