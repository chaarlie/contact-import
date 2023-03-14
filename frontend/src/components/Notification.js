import React from "react";

const Notification = ({ message, type, statusCode, children }) => {
  const classNames = ["alert", "m-auto", "col-10", "ml-10", type].join(" ");
  return (
    <div className="d-flex mt-5 justify-content-between">
      <div classNames="badge badge-primary text-wrap ">
        <p class="h5 mt-3 ">Status code {statusCode}</p>
      </div>
      <div className={classNames} role="alert">
        <h4>{message ? <pre>{message}</pre> : <pre>{children}</pre>}</h4>
      </div>
    </div>
  );
};

export default Notification;
