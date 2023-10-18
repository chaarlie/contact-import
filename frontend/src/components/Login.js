import axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import { GlobalContext } from "../context/GlobalState";

const Login = () => {
  const { loginUser, setToken } = useContext(GlobalContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const history = useHistory();

  const LoginButton = (props) => {
    const { disabled, text, handleLogin } = props;

    return (
      <button
        disabled={disabled}
        name="submit"
        type="submit"
        className="btn btn-primary form-control"
        onClick={(e) => handleLogin()}
      >
        {text}
      </button>
    );
  };

  const ErrorMessage = ({ errors }) => {
    return (
      <div className="alert alert-danger" role="alert">
        {errors.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    );
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/user/auth/login", {
        username,
        password,
      });

      const config = {
        headers: { Authorization: `Bearer ${result.data.access_token}` },
      };

      const profileResponse = await axios.get(
        "http://localhost:3000/user/profile",
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
        <form>
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
                handleLogin={handleLogin}
                disabled={!(!!username && !!password)}
                text={"Submit"}
              />
            )}
          </div>
        </form>

        <div>
          <Link to="/register">
            <button type="button" class="btn btn-link">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
