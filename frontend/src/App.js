import "bootstrap/dist/css/bootstrap.min.css";

import { useContext } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Account from "./components/Account";
import { GlobalContext } from "./context/GlobalState";
import ProtectedRoute from "./components/ProtectedRoute";
import Contacts from "./components/Contacts";
import FailedContacts from "./components/FailedContacts";
import ProcessedFiles from "./components/ProcessedFiles";
import Register from "./components/Register";

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
