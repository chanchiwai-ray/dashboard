import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Row,
  Col,
  Container,
  FormControl,
  Nav,
  Dropdown,
  InputGroup,
  Modal,
} from "react-bootstrap";

import Note from "../components/Note/Note.jsx";
import Controller from "../components/Controller/Controller.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import { setCurrentPage } from "../redux/slices/common/settings.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { getNotes, putNote, postNote, deleteNote } from "../redux/slices/notes";
import { selectAuth, selectNotes } from "../redux/app/store.js";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import styles from "./views.module.css";

export default function NotesPage() {
  const auth = useSelector(selectAuth);
  const notes = useSelector(selectNotes);
  const dispatch = useDispatch();
  const [displayNewNoteForm, setDisplayNewNoteForm] = useState(false);
  const [filterString, setFilterString] = useState("");
  const [searchType, setSearchType] = useState("title");

  useEffect(() => {
    dispatch(setCurrentPage("Notes"));
    dispatch(
      getNotes({
        userId: auth.value.userId,
      })
    );
  }, []);

  return (
    <MainLayout>
      <Controller title="Notes" bg="light" expand="lg">
        <Nav>
          <Nav.Link onClick={() => setDisplayNewNoteForm(true)}>
            <FontAwesomeIcon className="fa-fw" icon={faPlusSquare} /> New Note
          </Nav.Link>
        </Nav>
        <div style={{ marginLeft: "auto" }}>
          <InputGroup>
            <FormControl
              type="text"
              placeholder={`Search note by ${searchType}...`}
              onChange={(e) => setFilterString(e.target.value)}
              value={filterString}
            />
            <InputGroup.Append>
              <Dropdown>
                <Dropdown.Toggle
                  bsPrefix={`${styles["dropdown-btn-overwrite"]}`}
                  as={InputGroup.Text}
                  className="btn btn-outline-info"
                >
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Dropdown.Toggle>
                <Dropdown.Menu align="right">
                  <Dropdown.Header>Search</Dropdown.Header>
                  <Dropdown.Item onClick={() => setSearchType("title")}>By Title</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSearchType("description")}>
                    By Description
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </Controller>
      <Container>
        <Row className="my-3">
          {notes.success ? (
            notes.value
              .filter((item) => item[searchType].includes(filterString))
              .sort((a, b) => a.modifiedDate < b.modifiedDate)
              .map((item) => (
                <Col key={item._id} className="my-3" md={{ offset: 2, span: 8 }}>
                  <Note
                    key={item._id}
                    item={item}
                    onDone={(newContent) =>
                      dispatch(
                        putNote({ id: item._id, userId: auth.value.userId, data: newContent })
                      )
                    }
                    onDelete={() =>
                      dispatch(deleteNote({ userId: auth.value.userId, id: item._id }))
                    }
                  />
                </Col>
              ))
          ) : (
            <h1>{notes.message}</h1>
          )}
        </Row>
      </Container>
      <Modal show={displayNewNoteForm} onHide={() => setDisplayNewNoteForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Note</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Note
            edit={true}
            item={{
              star: false,
              title: "",
              labels: [],
              textContent: "",
              listContent: [],
              imageContent: undefined,
              modifiedDate: Date.now(),
            }}
            onDelete={() => null}
            onDone={(data) => {
              dispatch(postNote({ userId: auth.value.userId, data: data }));
              setDisplayNewNoteForm(false);
            }}
            onCancel={() => setDisplayNewNoteForm(false)}
          />
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
}
