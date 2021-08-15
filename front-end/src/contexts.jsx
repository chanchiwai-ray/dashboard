import React from "react";

const Context = React.createContext({
  page: null,
  updatePage: () => {},
});

export default Context;
