import React from "react";

import { Navbar } from "react-bootstrap";

export default function Controller({ title, ...props }) {
  return (
    <Navbar {...props}>
      <Navbar.Brand>
        <h3>{title}</h3>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse id="navbar-collapse">{props.children}</Navbar.Collapse>
    </Navbar>
  );
}
