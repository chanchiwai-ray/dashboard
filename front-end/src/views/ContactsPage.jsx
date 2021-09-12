import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Container, FormControl, Nav } from "react-bootstrap";

import Contact from "../components/Contact/Contact.jsx";
import Controller from "../components/Controller/Controller.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import { setCurrentPage } from "../redux/slices/common/settings.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { getContacts, putContact, postContact, deleteContact } from "../redux/slices/contacts";
import { selectAuth, selectContacts } from "../redux/app/store.js";

export default function ContactPage() {
  const auth = useSelector(selectAuth);
  const contacts = useSelector(selectContacts);
  const dispatch = useDispatch();
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    dispatch(setCurrentPage("Contacts"));
    dispatch(getContacts());
  }, []);

  return (
    <MainLayout>
      <Controller title="People" bg="light" expand="lg">
        <Nav>
          <Nav.Link onClick={(data) => dispatch(postContact({ userId: auth.userId, data: data }))}>
            <FontAwesomeIcon className="fa-fw" icon={faPlusSquare} /> New Contact
          </Nav.Link>
        </Nav>
        <Nav style={{ marginLeft: "auto" }}>
          <Nav.Link>
            <FormControl
              type="text"
              placeholder="Search contact..."
              onChange={(e) => setFilterString(e.target.value)}
              value={filterString}
            />
          </Nav.Link>
        </Nav>
      </Controller>
      <Container>
        <Row className="my-3">
          {contacts.success ? (
            contacts.value
              .filter((contact) =>
                `${contact.firstname} ${contact.lastname}`.includes(filterString)
              )
              .map((contact, index) => (
                <Col key={index} md={6} className="my-3">
                  <Contact
                    key={index}
                    firstname={contact.firstname}
                    lastname={contact.lastname}
                    mobile={contact.mobile}
                    email={contact.email}
                    address={contact.address}
                    update={(data) =>
                      dispatch(putContact({ id: contact._id, userId: auth.userId, data: data }))
                    }
                    delete={() => dispatch(deleteContact({ id: contact._id }))}
                  />
                </Col>
              ))
          ) : (
            <h1>{contacts.message}</h1>
          )}
        </Row>
      </Container>
    </MainLayout>
  );
}
