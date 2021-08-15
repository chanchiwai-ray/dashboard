import React from "react";

import { Navbar, Nav } from "react-bootstrap";

export default function Controller({ title, ...props }) {
  return (
    <Navbar {...props}>
      <Navbar.Brand>
        <h3>{title}</h3>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse id="navbar-collapse">
        <Nav>{props.children}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
