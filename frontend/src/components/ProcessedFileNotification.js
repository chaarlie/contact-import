import React from "react";
import Notification from "./Notification";

const ProcessedFileNotification = ({ status }) => {
  const isStatusNotSet = status === null;
  const alertClass = status === "Finished" ? "alert-success" : "alert-danger";

  return (
    <>
      {isStatusNotSet ? (
        <div class="d-flex align-items-center alert alert-secondary">
          <strong>Loading...</strong>
          <div
            class="spinner-border ml-auto"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      ) : (
        <Notification message={`Upload ${status}`} type={alertClass} />
      )}
    </>
  );
};

export default ProcessedFileNotification;
