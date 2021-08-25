import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import DashboardPage from "./views/DashboardPage.jsx";
import ProfilePage from "./views/ProfilePage.jsx";
import FinancePage from "./views/FinancePage.jsx";
import LoginPage from "./views/LoginPage.jsx";

import "./index.css";
import Context from "./contexts.jsx";
import { useAuth, ProvideAuth } from "./authenticate.jsx";

const PrivateRoute = ({ component: Component, fallbackPath, ...props }) => {
  const auth = useAuth();

  return (
    <Route
      {...props}
      render={(props) => {
        return auth.isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: props.location }} />
        );
      }}
    />
  );
};

const Main = (props) => {
  const [currentPage, setCurrentPage] = useState(null);

  return (
    <ProvideAuth>
      <Context.Provider
        value={{
          page: currentPage,
          updatePage: (page) => setCurrentPage(page),
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <PrivateRoute path="/home" component={DashboardPage} />
            <PrivateRoute path="/profile" component={ProfilePage} />
            <PrivateRoute path="/finance" component={FinancePage} />
            <Redirect from="/" to={window.localStorage.getItem("redirect") || "/login"} />
            <Route
              render={() => (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "100%", height: "100%" }}
                >
                  <h1>404: Page not found...</h1>
                </div>
              )}
            />
          </Switch>
        </BrowserRouter>
      </Context.Provider>
    </ProvideAuth>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
