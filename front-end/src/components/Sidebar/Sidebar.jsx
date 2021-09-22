import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Sidebar.module.css";

export default function Sidebar({ navItems, state, activePageID }) {
  const addNavItem = (item, key) => (
    <Link
      key={key}
      className={`${styles["link"]} ${item.label === activePageID ? styles["link-focus"] : ""}`}
      to={item.to}
    >
      <div className="d-flex align-items-center">
        <FontAwesomeIcon className="fa-fw" icon={item.faIcon} />
        <span className={`${styles["link-text"]} d-none d-lg-block`}>{item.label}</span>
      </div>
    </Link>
  );

  return (
    <Collapse in={state} className={styles["container"]}>
      <div>{!navItems ? null : navItems.map((item, key) => addNavItem(item, key))}</div>
    </Collapse>
  );
}
