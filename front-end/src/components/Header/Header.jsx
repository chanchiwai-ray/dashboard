import React from "react";

import { Link } from "react-router-dom";
import { Nav, Navbar, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Header.module.css";

export default function Header({ brand, ...props }) {
  return (
    <Navbar variant="dark" bg="primary" sticky="top" expand="lg" className={`${styles.navbar}`}>
      <Nav className="mr-auto">{brand}</Nav>
      <Nav className="d-flex flex-row align-items-center">{props.children}</Nav>
      {props.extraChildren}
    </Navbar>
  );
}
