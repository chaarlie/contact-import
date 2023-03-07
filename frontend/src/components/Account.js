import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { GlobalContext } from "../context/GlobalState";

const Account = () => {
  const { loggedInUser, loginUser, logoutUser } = useContext(GlobalContext);
  const [username, setUsername] = useState(loggedInUser);
  const history = useHistory();

  const handleClick = () => {
    loginUser(username);
    history.goBack();
  };
  const handleLogout = () => {
    logoutUser();
    history.push("/");
  };

  return (
    <div className="text-center">
      <div className=" ">
        <div>
          <button
            onClick={(e) => handleLogout()}
            className="btn btn-default  float-right "
          >
            Logout
          </button>
        </div>
      </div>

      <br />
      <br />
      <br />

      <div>
        <h1>New username</h1>

        <div className="form-group">
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            name="username"
            type="text"
            className="form-control "
          />
        </div>

        <div className="form-group">
          <button
            name="submit"
            type="submit"
            className="btn btn-primary form-control"
            onClick={handleClick}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
