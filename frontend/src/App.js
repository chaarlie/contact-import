import "bootstrap/dist/css/bootstrap.min.css";

import { useContext } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./components/login/Login";
import Welcome from "./components/welcome/Welcome";
import Account from "./components/account/Account";
import { GlobalContext } from "./context/GlobalState";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Contacts from "./components/contacts/Contacts";
import FailedContacts from "./components/contacts/FailedContacts";
import ProcessedFiles from "./components/processed-files/ProcessedFiles";
import Register from "./components/register/Register";

function App() {
  const { loggedInUser } = useContext(GlobalContext);

  return (
    <div className="container">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          
          <ProtectedRoute
            isAuthenticated={!!loggedInUser}
            path="/processed-files"
            component={ProcessedFiles}
          />
          <ProtectedRoute
            isAuthenticated={!!loggedInUser}
            path="/failed-contacts"
            component={FailedContacts}
          />
          <ProtectedRoute
            isAuthenticated={!!loggedInUser}
            path="/welcome"
            component={Welcome}
          />
          <ProtectedRoute
            isAuthenticated={!!loggedInUser}
            path="/contacts"
            component={Contacts}
          />
          <ProtectedRoute
            isAuthenticated={!!loggedInUser}
            path="/account"
            component={Account}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
