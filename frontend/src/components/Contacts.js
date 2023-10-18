import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axiosConfig from "../config/axios";
import ContactHeader from "./ContactHeader";
import Navigation from "./Navigation";
import { GlobalContext } from "../context/GlobalState";

const Contacts = () => {
  const { token } = useContext(GlobalContext);
  const [_, setPageIndex] = useState(1);
  const [maxIndex, setMaxIndex] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [columnHeader] = useState({
    username: "username",
    birth: "birth",
    phone: "phone",
    address: "address",
    creditCardNumber: "creditCardNumber",
    creditCardNetwork: "creditCardNetwork",
    email: "email",
  });

  const fetchContacts = (index) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return axiosConfig.get(
      `user/import-contact-list?page=${index}`,
      config
    );
  };

  const initIndex = (response) => {
    setContacts(response.data.data);
    setMaxIndex(response.data.meta.totalPages);
  };

  const handleClickNext = (n) => {
    setPageIndex((val) => {
      let nextIndex = val + n;
      if (nextIndex <= 0) {
        fetchContacts(val).then(initIndex);
        return val;
      }
      nextIndex = nextIndex > maxIndex ? val : nextIndex;

      fetchContacts(nextIndex).then(initIndex);
      return nextIndex;
    });
  };

  const nextElements = () => {
    handleClickNext(1);
  };

  const prevElements = () => {
    handleClickNext(-1);
  };

  useEffect(() => {
    fetchContacts(1).then(initIndex);
  }, []);

  return (
    <div className="text-center">
      <div className="d-flex justify-content-between">
        <div className="alert alert-success col-12" role="alert">
          <h2>Contacts!</h2>
        </div>
      </div>

      <div>
        <br />
        <br />
        <br />

        <div>
          <Link to="/failed-contacts">
            {" "}
            <button type="button" class="btn btn-link">
              Go to Failed Contacts
            </button>
          </Link>
        </div>

        <Navigation />

        <table
          id="dtBasicExample"
          className="table table-striped table-bordered table-sm"
          cellspacing="0"
          width="100%"
        >
          <ContactHeader columnHeader={columnHeader}></ContactHeader>
          <tbody>
            {contacts.length > 0 &&
              contacts.map((_, i) => (
                <tr>
                  {Object.values(columnHeader).map((col) => {
                    const td = contacts[i][col] ? (
                      <td>{contacts[i][col]}</td>
                    ) : null;
                    return td;
                  })}
                </tr>
              ))}
          </tbody>
        </table>

        <div className="float-right">
          <button onClick={prevElements} type="button" className="btn btn-link">
            &#8592;
          </button>
          <button
            onClick={nextElements}
            type="button"
            className="btn btn-link float-right"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
