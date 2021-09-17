import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Container, FormControl, Nav, Modal } from "react-bootstrap";

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
  const [displayNewContactForm, setDisplayNewContactForm] = useState(false);
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    dispatch(setCurrentPage("Contacts"));
    dispatch(
      getContacts({
        userId: auth.value.userId,
      })
    );
  }, []);

  return (
    <MainLayout>
      <Controller title="People" bg="light" expand="lg">
        <Nav>
          <Nav.Link onClick={() => setDisplayNewContactForm(true)}>
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
              .map((contact) => (
                <Col key={contact._id} md={6} className="my-3">
                  <Contact
                    key={contact._id}
                    star={contact.star}
                    firstname={contact.firstname}
                    lastname={contact.lastname}
                    mobile={contact.mobile}
                    email={contact.email}
                    address={contact.address}
                    onDone={(data) =>
                      dispatch(
                        putContact({ id: contact._id, userId: auth.value.userId, data: data })
                      )
                    }
                    onDelete={() =>
                      dispatch(deleteContact({ userId: auth.value.userId, id: contact._id }))
                    }
                  />
                </Col>
              ))
          ) : (
            <h1>{contacts.message}</h1>
          )}
        </Row>
      </Container>
      <Modal show={displayNewContactForm} onHide={() => setDisplayNewContactForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Contact
            edit={true}
            star={false}
            firstname=""
            lastname=""
            mobile=""
            email=""
            address=""
            onDone={(data) => {
              dispatch(postContact({ userId: auth.value.userId, data: data }));
              setDisplayNewContactForm(false);
            }}
            onDelete={() => null}
            onCancel={() => setDisplayNewContactForm(false)}
          />
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
}
