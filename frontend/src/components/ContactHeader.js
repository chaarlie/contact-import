import React from "react";

const ContactHeader = ({ editable, columnHeader, modifyHeaderName }) => {
  const headerNames = Object.keys(columnHeader);
  return (
    <thead>
      <tr>
        {headerNames.length > 0 &&
          headerNames.map((headerName) => (
            <th class="th-sm">
              {editable ? (
                <input
                  onChange={modifyHeaderName}
                  type="text"
                  name={headerName}
                  value={columnHeader[headerName]}
                />
              ) : (
                <>{headerName}</>
              )}
            </th>
          ))}
      </tr>
    </thead>
  );
};

export default ContactHeader;
