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

import Task from "../components/Task/Task.jsx";
import Controller from "../components/Controller/Controller.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import { setCurrentPage } from "../redux/slices/common/settings.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { getTasks, putTask, postTask, deleteTask } from "../redux/slices/tasks";
import { selectAuth, selectTasks } from "../redux/app/store.js";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import styles from "./views.module.css";

const sorting = (x, y, type) => {
  if (type === "priority") {
    return x < y;
  } else if (type === "dueDate") {
    if (x && y) {
      return x > y;
    } else {
      return -1;
    }
  }
  return x > y;
};

export default function TasksPage() {
  const auth = useSelector(selectAuth);
  const tasks = useSelector(selectTasks);
  const dispatch = useDispatch();
  const [displayNewTaskForm, setDisplayNewTaskForm] = useState(false);
  const [filterString, setFilterString] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [sortType, setSortType] = useState("priority");

  const items = tasks.value.filter((task) => task[searchType].includes(filterString.trim()));
  const incompleteTasks = items
    .filter((item) => !item.completed)
    .sort((x, y) => sorting(x[sortType], y[sortType], sortType));
  const completedTasks = items
    .filter((item) => item.completed)
    .sort((x, y) => sorting(x[sortType], y[sortType], sortType));

  useEffect(() => {
    dispatch(setCurrentPage("Tasks"));
    dispatch(
      getTasks({
        userId: auth.value.userId,
      })
    );
  }, []);

  return (
    <MainLayout>
      <Controller title="Tasks" bg="light" expand="lg">
        <Nav>
          <Nav.Link onClick={() => setDisplayNewTaskForm(true)}>
            <FontAwesomeIcon className="fa-fw" icon={faPlusSquare} /> New Task
          </Nav.Link>
        </Nav>
        <div style={{ marginLeft: "auto" }}>
          <InputGroup>
            <FormControl
              type="text"
              placeholder={`Search task by ${searchType}...`}
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
                  <Dropdown.Item
                    className={`${searchType === "title" ? "font-weight-bold" : ""}`}
                    onClick={() => setSearchType("title")}
                  >
                    By Title
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={`${searchType === "description" ? "font-weight-bold" : ""}`}
                    onClick={() => setSearchType("description")}
                  >
                    By Description
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header>Sort by</Dropdown.Header>
                  <Dropdown.Item
                    className={`${sortType === "priority" ? "font-weight-bold" : ""}`}
                    onClick={() => setSortType("priority")}
                  >
                    Priority
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={`${sortType === "dueDate" ? "font-weight-bold" : ""}`}
                    onClick={() => setSortType("dueDate")}
                  >
                    Due Date
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header>More Options</Dropdown.Header>
                  <Dropdown.Item
                    onClick={() =>
                      incompleteTasks.forEach((t) =>
                        dispatch(
                          putTask({
                            userId: auth.value.userId,
                            id: t._id,
                            data: { ...t, completed: true },
                          })
                        )
                      )
                    }
                  >
                    Mark all as completed
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      completedTasks.forEach((t) =>
                        dispatch(
                          putTask({
                            userId: auth.value.userId,
                            id: t._id,
                            data: { ...t, completed: false },
                          })
                        )
                      )
                    }
                  >
                    Mark all as incomplete
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      completedTasks.forEach((t) =>
                        dispatch(deleteTask({ userId: auth.value.userId, id: t._id }))
                      )
                    }
                  >
                    Remove all completed tasks
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </Controller>
      <Container>
        <Row className="my-3">
          <Col className="p-3" xs={12}>
            {incompleteTasks.length === 0 ? (
              <div className="text-center py-5">
                <h4>Nothing to do yet, add some tasks ...</h4>
              </div>
            ) : (
              incompleteTasks.map((content) => (
                <Task
                  key={content._id}
                  content={content}
                  onDone={(newContent) =>
                    dispatch(
                      putTask({ id: content._id, userId: auth.value.userId, data: newContent })
                    )
                  }
                  onDelete={() =>
                    dispatch(deleteTask({ userId: auth.value.userId, id: content._id }))
                  }
                />
              ))
            )}
          </Col>
          <Col className="p-3" xs={12}>
            <hr />
          </Col>
          <Col className="p-3" xs={12}>
            {completedTasks.map((content) => (
              <Task
                key={content._id}
                content={content}
                onDone={(newContent) =>
                  dispatch(
                    putTask({ id: content._id, userId: auth.value.userId, data: newContent })
                  )
                }
                onDelete={() =>
                  dispatch(deleteTask({ userId: auth.value.userId, id: content._id }))
                }
              />
            ))}
          </Col>
        </Row>
      </Container>
      <Modal size="lg" show={displayNewTaskForm} onHide={() => setDisplayNewTaskForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-0">
          <Task
            edit={true}
            content={{
              star: false,
              title: "",
              completed: false,
              description: "",
              modifiedDate: Date.now(),
              dueDate: undefined,
              priority: 0,
            }}
            onDone={(data) => {
              dispatch(postTask({ userId: auth.value.userId, data: data }));
              setDisplayNewTaskForm(false);
            }}
            onDelete={() => null}
            onCancel={() => setDisplayNewTaskForm(false)}
          />
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
}
