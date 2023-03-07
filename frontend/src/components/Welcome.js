import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import ContactHeader from "./ContactHeader";
import Notification from "./Notification";
import Navigation from "./Navigation";
import { GlobalContext } from "../context/GlobalState";

import axios from "axios";

const Welcome = () => {
  const { loggedInUser, token } = useContext(GlobalContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploadFinished, setIsUploadFinished] = useState(false);
  const [columnHeader, setColumnHeader] = useState({
    username: "username",
    birth: "birth",
    phone: "phone",
    address: "address",
    "credit card number": "creditCardNumber",
    email: "email",
  });

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();

      formData.append("file", selectedFile);
      Object.keys(columnHeader).forEach((col) =>
        formData.append(col, columnHeader[col])
      );

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        await axios.post(
          "/contacts-import",
          formData,
          config
        );

        setUploadError(null);

        setIsUploadFinished(true);
      } catch (error) {
        setUploadError(error.message);
        setIsUploadFinished(true);
      }
    }
  };

  const handleSelectFile = (event) => {
    const { files } = event.currentTarget;
    setIsUploadFinished(false);

    if (files?.length) {
      setSelectedFile(files[0]);
    }
  };

  const modifyHeaderName = (event) => {
    setColumnHeader((val) => {
      return {
        ...val,
        [event.target.name]: event.target.value,
      };
    });
  };
  return (
    <div className="text-center">
      <div className="d-flex justify-content-between">
        <div className="alert alert-success col-12" role="alert">
          <h2>Welcome!</h2>
        </div>
      </div>

      <div>
        <h1>{loggedInUser}</h1>

        <br />

        <div>
          <Link to="/contacts">
            {" "}
            <button type="button" class="btn btn-link">
              Go to Contacts
            </button>
          </Link>
        </div>

        <Navigation />

        <ContactHeader
          editable={true}
          modifyHeaderName={modifyHeaderName}
          columnHeader={columnHeader}
        ></ContactHeader>

        <form onSubmit={handleFileUpload}>
          <div className="form-group">
            <label htmlFor="username">File </label>
            <input
              onChange={handleSelectFile}
              name="file"
              type="file"
              className="form-control"
            />
          </div>
          <input type="submit" value="submit" />
        </form>

        {isUploadFinished && (
          <>
            {uploadError ? (
              <Notification message={uploadError} type="alert-danger" />
            ) : (
              <Notification
                message={"upload successful"}
                type="alert-success"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Welcome;
