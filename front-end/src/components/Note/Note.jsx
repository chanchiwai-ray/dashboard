import React, { useState } from "react";
import { useFormik } from "formik";

import {
  Row,
  Col,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Form,
  Card,
  ListGroup,
  Button,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import { faImage, faListAlt, faTrash, faEdit, faTag } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";

const CheckList = ({ content, onDone, onEdit, isEditing }) => {
  const onChange = (id, key, value) => {
    const updatedContent = content.map((item) => {
      const newItem = { ...item };
      if (newItem.id === id) {
        newItem[key] = value;
        return newItem;
      } else {
        return newItem;
      }
    });
    onEdit(updatedContent);
    if (!isEditing) {
      onDone();
    }
  };

  const onDelete = (id) => {
    const updatedContent = content.filter((item) => item.id !== id);
    onDone(updatedContent);
  };

  return (
    <ListGroup variant="flush">
      {content.map((item) => (
        <ListGroup.Item key={item.id}>
          <Row className="align-items-center">
            <Col xs={1} className="d-flex justify-content-center">
              {item.completed ? (
                <OverlayTrigger overlay={<Tooltip>UnCheck</Tooltip>}>
                  <FontAwesomeIcon
                    className="fontawesome-as-btn"
                    icon={faCheckSquare}
                    onClick={(e) => onChange(item.id, "completed", false)}
                  />
                </OverlayTrigger>
              ) : (
                <OverlayTrigger overlay={<Tooltip>Check</Tooltip>}>
                  <FontAwesomeIcon
                    className="fontawesome-as-btn"
                    icon={faSquare}
                    onClick={(e) => onChange(item.id, "completed", true)}
                  />
                </OverlayTrigger>
              )}
            </Col>
            <Col sx={10} className="d-flex">
              {!isEditing ? (
                <span>{item.title}</span>
              ) : (
                <input
                  className="input-as-list-item"
                  id="title"
                  name="title"
                  onChange={(e) => onChange(item.id, "title", e.target.value.trim())}
                  value={item.title}
                />
              )}
            </Col>
            <Col xs={1} className="d-flex justify-content-center">
              {!isEditing ? (
                <React.Fragment></React.Fragment>
              ) : (
                <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                  <FontAwesomeIcon
                    className="fontawesome-as-btn mx-1"
                    color="red"
                    icon={faTrash}
                    onClick={(e) => onDelete(item.id)}
                  />
                </OverlayTrigger>
              )}
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
export default function Note({ item, onDelete, onDone, onCancel, ...props }) {
  const [isEditing, setEditing] = useState(props.edit);
  const formik = useFormik({
    initialValues: {
      title: item.title || "",
      labels: item.labels || [],
      textContent: item.textContent || "",
      listContent: item.listContent || [],
      imageContent: item.imageContent || undefined,
      modifiedDate: item.modifiedDate || Date.now(),
    },
    onSubmit: (values) => {
      const editedValues = {
        ...formik.values,
        modifiedDate: Date.now(),
      };
      editedValues.listContent = editedValues.listContent.filter(
        (item) => item.title.trim() !== ""
      );
      setEditing(false);
      onDone(editedValues);
    },
    enableReinitialize: true,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Card>
        <Card.Header>
          <div></div>
          <div className="d-flex ">
            <div className="mr-auto">
              <FontAwesomeIcon icon={faTag} color="grey" className="fa-fw mr-1" size="sm" />
              {item.labels
                ? item.labels.map((label) => (
                    <Badge className="mx-1" key={label._id} pill variant="primary">
                      {label.label}
                    </Badge>
                  ))
                : null}
            </div>
            <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
              <FontAwesomeIcon
                className="fontawesome-as-btn mx-1"
                color="green"
                icon={faEdit}
                onClick={(e) => {
                  e.stopPropagation();
                  isEditing || setEditing(!isEditing);
                }}
              />
            </OverlayTrigger>
            <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
              <FontAwesomeIcon
                className="fontawesome-as-btn mx-1"
                color="red"
                icon={faTrash}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              />
            </OverlayTrigger>
          </div>
        </Card.Header>
        <Card.Body>
          {!formik.values.imageContent ? (
            <div></div>
          ) : (
            <React.Fragment>
              <Card.Img src={item.imageContent} />
              <hr />
            </React.Fragment>
          )}
          <Card.Title>
            {!isEditing ? (
              formik.values.title
            ) : (
              <input
                className="form-control input-as-list-item"
                id="title"
                name="title"
                placeholder="Note Title"
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            )}
          </Card.Title>
          <Card.Text>
            {!isEditing ? (
              formik.values.textContent
            ) : (
              <textarea
                className="form-control input-as-list-item"
                id="textContent"
                name="textContent"
                placeholder="Description"
                onChange={formik.handleChange}
                value={formik.values.textContent}
              />
            )}
          </Card.Text>
        </Card.Body>
        {!formik.values.listContent || formik.values.listContent.length === 0 ? (
          <div></div>
        ) : (
          <CheckList
            content={formik.values.listContent}
            onDone={() => formik.handleSubmit()}
            onEdit={(newContent) => formik.setFieldValue("listContent", newContent)}
            isEditing={isEditing}
          />
        )}
        <Card.Footer className="text-muted d-flex">
          {!isEditing ? (
            <span className="ml-auto">{`Last modified: ${
              new Date(Number(item.modifiedDate)).toLocaleString("en-GB") || ""
            }`}</span>
          ) : (
            <React.Fragment>
              <OverlayTrigger overlay={<Tooltip>Add Items</Tooltip>}>
                <InputGroup.Text
                  className="btn btn-outline-success mx-1"
                  onClick={() =>
                    formik.setFieldValue("listContent", [
                      ...formik.values.listContent,
                      { id: uuid(), title: "", completed: false },
                    ])
                  }
                >
                  <FontAwesomeIcon icon={faListAlt} />
                </InputGroup.Text>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>Add Picture</Tooltip>}>
                <InputGroup.Text
                  className="btn btn-outline-warning mx-1"
                  onClick={() => console.log("Add picture")}
                >
                  <FontAwesomeIcon icon={faImage} />
                </InputGroup.Text>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>Add Label</Tooltip>}>
                <InputGroup.Text
                  className="btn btn-outline-info mx-1"
                  onClick={() => console.log("Add picture")}
                >
                  <FontAwesomeIcon icon={faTag} />
                </InputGroup.Text>
              </OverlayTrigger>
              <div className="ml-auto">
                <Button className="ml-auto mr-1" variant="primary" type="submit">
                  Done
                </Button>
                <Button
                  className="ml-auto mr-1"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(false);
                    formik.resetForm();
                    if (onCancel) {
                      onCancel();
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            </React.Fragment>
          )}
        </Card.Footer>
      </Card>
    </Form>
  );
}
