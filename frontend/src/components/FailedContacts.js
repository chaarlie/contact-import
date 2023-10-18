import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axiosConfig from "../config/axios";
import Navigation from "./Navigation";
import { GlobalContext } from "../context/GlobalState";

const FailedContacts = () => {
  const { token } = useContext(GlobalContext);
  const [failedContacts, setFailedContacts] = useState([]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axiosConfig
      .get("/user/failed-contact-list", config)
      .then((response) => {
        setFailedContacts(response.data[0].importLogs);
      });
  }, []);

  return (
    <div className="text-center">
      <div className="d-flex justify-content-between">
        <div className="alert alert-success col-12" role="alert">
          <h2>Processed Files!</h2>
        </div>
      </div>

      <div>
        <Link to="/processed-files">
          {" "}
          <button type="button" class="btn btn-link">
            Go to Processed Files
          </button>
        </Link>
      </div>

      <Navigation />

      <div className=" overflow-auto " style={{ height: "32rem" }}>
        <table
          id="dtBasicExample"
          className="table table-striped table-bordered table-sm"
          cellspacing="0"
          width="100%"
        >
          <tbody>
            {failedContacts.length > 0 &&
              failedContacts.map(({ message, id }) => (
                <tr key={id}>
                  {" "}
                  <td>{message}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FailedContacts;
