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
  Button,
} from "react-bootstrap";

import Note from "../components/Note/Note.jsx";
import Controller from "../components/Controller/Controller.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import { setCurrentPage } from "../redux/slices/common/settings.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { getNotes, putNote, postNote, deleteNote } from "../redux/slices/notes";
import { selectAuth, selectNotes } from "../redux/app/store.js";
import { faEllipsisH, faEllipsisV, faSort } from "@fortawesome/free-solid-svg-icons";

const NewNoteBar = ({ onNew, ...props }) => {
  const [label, setLabel] = useState("default");
  const formik = useFormik({
    initialValues: {
      textContent: "",
    },
    onSubmit: (values) => {
      const submitValues = {
        title: "",
        uuid: uuid(),
        label: "default",
        listContent: undefined,
        imageContent: undefined,
        modifiedDate: new Date(),
      };
      console.log(submitValues);
      onNew(submitValues);
      formik.setFieldValue("textContent", "");
    },
  });

  return (
    <Form className="new-note-bar" onSubmit={formik.handleSubmit}>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faEllipsisV} />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <input
          className="form-control"
          placeholder="Enter new content..."
          id="textContent"
          name="textContent"
          onChange={formik.handleChange}
          value={formik.values.textContent}
        />
        <InputGroup.Append>
          <OverlayTrigger overlay={<Tooltip>Add</Tooltip>}>
            <InputGroup.Text
              className="btn btn-outline-success btn-outline-overwrite"
              onClick={() => formik.handleSubmit()}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </InputGroup.Text>
          </OverlayTrigger>
        </InputGroup.Append>
        <InputGroup.Append>
          <OverlayTrigger overlay={<Tooltip>Options</Tooltip>}></OverlayTrigger>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};

export default function NotesPage() {
  const auth = useSelector(selectAuth);
  const notes = useSelector(selectNotes);
  const dispatch = useDispatch();
  const [sortKey, setSortKey] = useState("date");
  const [displayNewNoteForm, setDisplayNewNoteForm] = useState(false);
  const [displayNewLabelForm, setDisplayNewLabelForm] = useState(false);
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
        <Dropdown style={{ marginLeft: "auto" }}>
          <InputGroup>
            <FormControl
              type="text"
              placeholder={`Search note by ${searchType}...`}
              onChange={(e) => setFilterString(e.target.value)}
              value={filterString}
            />
            <Dropdown.Toggle
              bsPrefix="dropdown-btn-overwrite"
              as={InputGroup.Text}
              className="btn btn-outline-info"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </Dropdown.Toggle>
          </InputGroup>
          <Dropdown.Menu>
            <Dropdown.Header>Search</Dropdown.Header>
            <Dropdown.Item onClick={() => setSearchType("title")}>By Title</Dropdown.Item>
            <Dropdown.Item onClick={() => setSearchType("description")}>
              By Description
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
