import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import DashboardPage from "./views/DashboardPage.jsx";
import ProfilePage from "./views/ProfilePage.jsx";
import ExpensePage from "./views/ExpensePage.jsx";
import LoginPage from "./views/LoginPage.jsx";

import "./index.css";
import { selectAuth, store } from "./redux/app/store.js";
import { Provider, useDispatch, useSelector } from "react-redux";
import { verify } from "./redux/slices/common/auth.js";

const PrivateRoute = ({ component: Component, fallbackPath, ...props }) => {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verify());
  }, []);

  return (
    <Route
      {...props}
      render={(props) => {
        return auth.value.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: auth.value.redirect, state: props.location }} />
        );
      }}
    />
  );
};

const Main = (props) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <PrivateRoute path="/home" component={DashboardPage} />
          <PrivateRoute path="/profile" component={ProfilePage} />
          <PrivateRoute path="/expense" component={ExpensePage} />
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
    </Provider>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
