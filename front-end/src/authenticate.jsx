import React, { useState, useEffect, useContext, createContext } from "react";

// create context
const authContext = createContext();

// define context
// FIXME: find a better way to keep the authentication state persistently (e.g. using redux-persist)
function useProvideAuth() {
  const [userId, setUserId] = useState(null);

  const isAuthenticated = () => {
    return window.localStorage.getItem("authenticated") === "true";
    // return userId !== null;
  };

  const verifySession = (onSuccess, onFailure) => {
    fetch(`${process.env.REACT_APP_API_HOST}/authenticate/verify`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUserId(res.payload);
          // FIXME: find a better way to keep the authentication state persistently (e.g. using redux-persist)
          window.localStorage.setItem("redirect", "/home");
          window.localStorage.setItem("authenticated", "true");
          if (onSuccess) onSuccess(res);
        } else {
          setUserId(null);
          window.localStorage.setItem("redirect", "/login");
          window.localStorage.setItem("authenticated", "false");
          if (onFailure) onFailure(res);
        }
      })
      .catch((err) => {
        setUserId(null);
        window.localStorage.removeItem("redirect");
        window.localStorage.removeItem("authenticated");
        if (onFailure)
          onFailure({ success: false, message: "500: Internal Server Side Error.", payload: null });
      });
  };

  const login = (formData, onSuccess, onFailure) => {
    fetch(`${process.env.REACT_APP_API_HOST}/authenticate/login`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUserId(res.payload);
          // FIXME: find a better way to keep the authentication state persistently (e.g. using redux-persist)
          window.localStorage.setItem("authenticated", "true");
          window.localStorage.setItem("redirect", "/home");
          if (onSuccess) onSuccess(res);
        } else {
          setUserId(null);
          window.localStorage.setItem("redirect", "/login");
          window.localStorage.setItem("authenticated", "false");
          if (onFailure) onFailure(res);
        }
      })
      .catch((err) => {
        setUserId(null);
        window.localStorage.setItem("redirect", "/login");
        window.localStorage.setItem("authenticated", "false");
        if (onFailure)
          onFailure({ success: false, message: "500: Internal Server Side Error.", payload: null });
      });
  };

  const signup = (formData, onSuccess, onFailure) => {
    fetch(`${process.env.REACT_APP_API_HOST}/authenticate/signup`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUserId(res.payload);
          // FIXME: find a better way to keep the authentication state persistently (e.g. using redux-persist)
          window.localStorage.setItem("authenticated", "true");
          window.localStorage.setItem("redirect", "/home");
          if (onSuccess) onSuccess(res);
        } else {
          setUserId(null);
          window.localStorage.setItem("redirect", "/login");
          window.localStorage.setItem("authenticated", "false");
          if (onFailure) onFailure(res);
        }
      })
      .catch((err) => {
        setUserId(null);
        window.localStorage.setItem("redirect", "/login");
        window.localStorage.setItem("authenticated", "false");
        if (onFailure)
          onFailure({ success: false, message: "500: Internal Server Side Error.", payload: null });
      });
  };

  const logout = (onSuccess, onFailure) => {
    fetch(`${process.env.REACT_APP_API_HOST}/authenticate/logout`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUserId(null);
          // FIXME: find a better way to keep the authentication state persistently (e.g. using redux-persist)
          window.localStorage.setItem("authenticated", "false");
          window.localStorage.setItem("redirect", "/login");
          if (onSuccess) onSuccess(res);
        } else {
          window.localStorage.removeItem("redirect");
          window.localStorage.removeItem("authenticated");
          if (onFailure) onFailure(res);
        }
      })
      .catch((err) => {
        setUserId(null);
        window.localStorage.removeItem("redirect");
        window.localStorage.removeItem("authenticated");
        if (onFailure)
          onFailure({ success: false, message: "500: Internal Server Side Error.", payload: null });
      });
  };

  useEffect(() => {}, []);

  return {
    userId,
    isAuthenticated,
    login,
    signup,
    logout,
    verifySession,
  };
}

// wrapper over useContext
export function useAuth() {
  return useContext(authContext);
}

// wrapper over Context.Provider
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
