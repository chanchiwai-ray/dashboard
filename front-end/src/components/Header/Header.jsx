import React from "react";

import { Link } from "react-router-dom";
import { Nav, Navbar, Button, Tooltip, OverlayTrigger } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Header({ brand, navItems, toggleSidebar, ...props }) {
  return (
    <Navbar variant="dark" bg="primary" sticky="top" expand="md">
      <Navbar.Brand className="mr-auto">
        <OverlayTrigger
          key="bottom"
          placement="bottom"
          overlay={<Tooltip>Menu</Tooltip>}
        >
          <Button onClick={() => toggleSidebar()}>{brand}</Button>
        </OverlayTrigger>
      </Navbar.Brand>
      <nav className="d-flex flex-row align-items-center">
        <Nav className="d-flex flex-row align-items-center">
          {!navItems
            ? null
            : navItems.map((item, key) => (
                <OverlayTrigger
                  key={key}
                  placement="bottom"
                  overlay={<Tooltip>{item.label}</Tooltip>}
                >
                  <Link to={item.to}>
                    <Nav.Item key={key} as={Button}>
                      <FontAwesomeIcon color="white" icon={item.faIcon} />
                    </Nav.Item>
                  </Link>
                </OverlayTrigger>
              ))}
        </Nav>
        {
          // Optional children to be appended to the navbar items
          props.children
        }
      </nav>
    </Navbar>
  );
}

export default Header;
