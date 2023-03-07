import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './AppWrapper';

// const style = {
//   table: {
//     borderCollapse: 'collapse'
//   },
//   tableCell: {
//     border: '1px solid gray',
//     margin: 0,
//     padding: '5px 10px',
//     width: 'max-content',
//     minWidth: '150px'
//   },
//   form: {
//     container: {
//       padding: '20px',
//       border: '1px solid #F0F8FF',
//       borderRadius: '15px',
//       width: 'max-content',
//       marginBottom: '40px'
//     },
//     inputs: {
//       marginBottom: '5px'
//     },
//     submitBtn: {
//       marginTop: '10px',
//       padding: '10px 15px',
//       border:'none',
//       backgroundColor: 'lightseagreen',
//       fontSize: '14px',
//       borderRadius: '5px'
//     }
//   }
// }

// function PhoneBookForm({ phoneBook, setPhoneBook }) {
//   const [ phoneInfo, setPhoneInfo ] = useState({
//     userFirstname : 'Coder',
//     userLastname : 'Byte',
//     userPhone : '8885559999'
//   });

//   useEffect(() => {
//   // setPhoneInfo({ })
//   }, [])

//   const handleChange = e => {
//     const { name: key, value } = e.target;
    
//     setPhoneInfo({
//       ...phoneInfo,
//       [key]: value
//     });
//   }

//   const handleSubmit = e => {
//     e.preventDefault();

//     setPhoneBook([ ...phoneBook, phoneInfo ])
//   }
//   return (
//     <form onSubmit={e => handleSubmit(e)} style={style.form.container}>
//       <label>First name:</label>
//       <br />
//       {phoneBook && 
//       phoneBook.userFirstname &&
//       phoneBook.userLastname && 
//       phoneBook.userPhone && (
//         <></>
//       )}
      
//     </form>
//   )
// }

// function InformationTable({ phoneBook }) {
//   return (
//     <table style={style.table} className='informationTable'>
//       <thead> 
//         <tr>
//           <th style={style.tableCell}>First name</th>
//           <th style={style.tableCell}>Last name</th>
//           <th style={style.tableCell}>Phone</th>
//         </tr>
//       </thead>
//       <tbody>
//       {phoneBook.map(({ userFirstname, userLastname, userPhone }, idx) => (
//         <tr key={idx}>
//           <td>{userFirstname}</td>
//           <td>{userLastname}</td>
//           <td>{userPhone}</td>
//         </tr>
//       ))}
//       </tbody>
//     </table>
//   );
// }

// function Application(props) {
//   const [ phoneBook, setPhoneBook ] = useState([]);

//   return (
//     <section>
      
//     </section>
//   );
// }

ReactDOM.render(
  <AppWrapper />,
  document.getElementById('root')
);