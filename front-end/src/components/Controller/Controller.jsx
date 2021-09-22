import React from "react";

import { Navbar } from "react-bootstrap";

import styles from "./Controller.module.css";

export default function Controller({ title, ...props }) {
  return (
    <Navbar {...props} className={`${styles["controller"]}`}>
      <Navbar.Brand>
        <span className={`${styles["title"]}`}>{title}</span>
      </Navbar.Brand>
      <Navbar.Toggle className={`${styles["toggler"]}`} />
      <Navbar.Collapse id="navbar-collapse">{props.children}</Navbar.Collapse>
    </Navbar>
  );
}
