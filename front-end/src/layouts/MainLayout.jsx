import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Container, Row, Col, Dropdown, OverlayTrigger, Tooltip, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCog,
  faBars,
  faHome,
  faWallet,
  faAddressBook,
  faStickyNote,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";

import Header from "../components/Header/Header.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, selectSettings } from "../redux/app/store.js";
import { logout } from "../redux/slices/common/auth.js";

import styles from "./layouts.module.css";

const headerNavItems = [
  {
    to: "/home",
    label: "Home",
    faIcon: faHome,
  },
];

const sidebarNavItems = [
  {
    to: "/home",
    label: "Home",
    faIcon: faHome,
  },
  {
    to: "/tasks",
    label: "Tasks",
    faIcon: faTasks,
  },
  {
    to: "/notes",
    label: "Notes",
    faIcon: faStickyNote,
  },
  {
    to: "/expense",
    label: "Expense",
    faIcon: faWallet,
  },
  {
    to: "/contacts",
    label: "Contacts",
    faIcon: faAddressBook,
  },
];

export default function MainLayout(props) {
  const auth = useSelector(selectAuth);
  const settings = useSelector(selectSettings);
  const dispatch = useDispatch();
  const history = useHistory();
  const [sidebarState, setSidebarState] = useState(true);

  useEffect(() => {
    if (!auth.value.authenticated) {
      history.replace(auth.value.redirect);
    }
  }, [auth]);

  return (
    <React.Fragment>
      <Header
        brand={
          <OverlayTrigger key="bottom" placement="bottom" overlay={<Tooltip>Menu</Tooltip>}>
            <Nav.Item
              className={`${styles["nav-item"]}`}
              onClick={() => setSidebarState(!sidebarState)}
            >
              <FontAwesomeIcon className="fa-lg fa-fw" color="white" icon={faBars} />
            </Nav.Item>
          </OverlayTrigger>
        }
        extraChildren={
          <Dropdown alignRight>
            <OverlayTrigger key="bottom" placement="bottom" overlay={<Tooltip>Settings</Tooltip>}>
              <Dropdown.Toggle as={Nav.Item} className={`${styles["nav-item"]}`}>
                <FontAwesomeIcon color="white" icon={faUserCog} />
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu>
              <Link style={{ textDecoration: "none", color: "black" }} to="/profile">
                <Dropdown.Item as="button">
                  <span>Profile</span>
                </Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => dispatch(logout())}>
                <span>Log Out</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }
      >
        {!headerNavItems
          ? null
          : headerNavItems.map((item, key) => (
              <OverlayTrigger
                key={key}
                placement="bottom"
                overlay={<Tooltip>{item.label}</Tooltip>}
              >
                <Link to={item.to}>
                  <Nav.Item className={`${styles["nav-item"]}`} key={key}>
                    <FontAwesomeIcon color="white" icon={item.faIcon} />
                  </Nav.Item>
                </Link>
              </OverlayTrigger>
            ))}
      </Header>
      <Container fluid>
        <Row>
          <Sidebar
            id="sidebar-container"
            navItems={sidebarNavItems}
            state={sidebarState}
            activePageID={settings.currentPage}
          />
          <Col className="p-0 main-panel">{props.children}</Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
