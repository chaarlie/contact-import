import React, { useContext, useState, useEffect } from "react";

import axiosConfig from "../../config/axios";
import Navigation from "../navigation/Navigation";
import { GlobalContext } from "../../context/GlobalState";

const ProcessedFiles = () => {
  const { token } = useContext(GlobalContext);
  const [processedFiles, setProcessedFiles] = useState([]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axiosConfig.get("/user/processed-file-list", config)
      .then((response) => {
        setProcessedFiles(response.data[0].importFiles);
      });
  }, []);

  return (
    <div className="text-center">
      <div className="d-flex justify-content-between">
        <div className="alert alert-success col-12" role="alert">
          <h2>Failed Contacts!</h2>
        </div>
      </div>

      <div className=" overflow-auto " style={{ height: "32rem" }}>
        <Navigation />
        <table
          id="dtBasicExample"
          className="table table-striped table-bordered table-sm overflow-auto "
          cellspacing="0"
          width="100%"
        >
          <tbody>
            {processedFiles.length > 0 &&
              processedFiles.map(({ fileName, status, id }) => (
                <tr key={id}>
                  {" "}
                  <td>
                    {fileName} - {status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessedFiles;
