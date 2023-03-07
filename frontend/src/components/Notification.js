import React from "react";

const Notification = ({ message, type, statusCode }) => {
  const classNames = ["alert", "m-auto", "col-8", type].join(" ");
  return (
    <div className="d-flex mt-5 justify-content-between">
      <div classNames="badge badge-primary text-wrap ">
        <p class="h5 mt-3">Status code {statusCode}</p>
      </div>
      <div className={classNames} role="alert">
        <h4>
          <pre>{message}</pre>
        </h4>
      </div>
    </div>
  );
};

export default Notification;
