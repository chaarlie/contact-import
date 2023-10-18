import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import ErrorMessage from "./ErrorMessage";
import LoginButton from "./LoginButton";
import axiosConfig from "../config/axios";
import { GlobalContext } from "../context/GlobalState";

const Login = () => {
  const { loginUser, setToken } = useContext(GlobalContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await axiosConfig.post("/user/auth/login", {
        username,
        password,
      });

      const config = {
        headers: { Authorization: `Bearer ${result.data.access_token}` },
      };

      const profileResponse = await axiosConfig.get(
        "/user/profile",
        config
      );

      if (profileResponse.data.username) {
        const email = profileResponse.data.username;
        loginUser(email);
        setToken(result.data.access_token);
        history.push("/welcome");
      }
    } catch (error) {
      if (Array.isArray(error)) setErrors(error);
      else {
        console.error(error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="col-6  ">
        {errors.length > 0 && <ErrorMessage errors={errors} />}
        <h3>Sign In </h3>
        <form onSubmit={ (e) => { handleSubmit(e) }}>
          <div className="form-group">
            <label htmlFor="username">Email address or Username</label>
            <input
              onChange={(e) => {
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
            {loading ? (
              <LoginButton text={"Loading..."} />
            ) : (
              <LoginButton
                disabled={!(!!username && !!password)}
                text={"Submit"}
              />
              )} 
          </div>
        </form>

        <div>
          <Link to="/register">
            <button type="button" className="btn btn-link">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
