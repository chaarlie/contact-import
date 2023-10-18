import React from 'react'

const LoginButton = ({ disabled, text }) => {
    return (
      <button
        disabled={disabled}
        name="submit"
        type="submit"
        className="btn btn-primary form-control"
      >
        {text}
      </button>
    );
};

export default LoginButton;