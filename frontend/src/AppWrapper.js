 
import 'bootstrap/dist/css/bootstrap.min.css';

import  React from "react";

import App from "./App";

import {GlobalProvider} from './context/GlobalState';

function AppWrapper() {
  return (
    
    <GlobalProvider>
        <App />
    </GlobalProvider>
  );
}

export default AppWrapper;
