import React, { useState } from "react";
import { useFormik } from "formik";

import { Row, Col, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquare,
  faCheckSquare,
  faStar as faStarFilled,
} from "@fortawesome/free-regular-svg-icons";
import { faEdit, faTrash, faStar as faStarHollow } from "@fortawesome/free-solid-svg-icons";

import styles from "./Task.module.css";

export default function Task({ content, onDelete, onDone, onCancel, ...props }) {
  const [isEditing, setEditing] = useState(props.edit);
  const formik = useFormik({
    initialValues: {
      star: content.star || false,
      title: content.title || "",
      completed: content.completed || false,
      description: content.description || "",
      modifiedDate: content.modifiedDate || Date.now(),
      dueDate: content.dueDate || "",
      priority: content.priority || 0,
    },
    onSubmit: (values) => {
      const editedValues = {
        ...formik.values,
        modifiedDate: Date.now(),
      };
      if (editedValues.dueDate && isNaN(Number(editedValues.dueDate))) {
        const [year, month, day] = editedValues.dueDate.split("-");
        editedValues.dueDate = Date.parse(new Date(year, month - 1, day));
      }
      setEditing(false);
      onDone(editedValues);
    },
    enableReinitialize: true,
  });

  const convertToDateString = (date) => {
    if (date && !isNaN(Number(date))) {
      const d = new Date(Number(date));
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    } else if (date) {
      return date;
    }
    return "";
  };

  const renderCheckBox = () => (
    <OverlayTrigger overlay={<Tooltip>{formik.values.completed ? "UnCheck" : "Check"}</Tooltip>}>
      <FontAwesomeIcon
        className={`${styles["fontawesome-as-btn"]} mx-1`}
        icon={formik.values.completed ? faCheckSquare : faSquare}
        onClick={() => {
          formik.setFieldValue("completed", !formik.values.completed);
          if (!isEditing) {
            formik.handleSubmit();
          }
        }}
      />
    </OverlayTrigger>
  );

  const renderStarEditDelete = () => (
    <React.Fragment>
      <OverlayTrigger overlay={<Tooltip>{formik.values.star ? "Unstar" : "Star"}</Tooltip>}>
        <FontAwesomeIcon
          className={`${styles["fontawesome-as-btn"]} mx-1`}
          color="#ff55f2"
          icon={formik.values.star ? faStarHollow : faStarFilled}
          onClick={() => {
            formik.setFieldValue("star", !formik.values.star);
            if (!isEditing) {
              formik.handleSubmit();
            }
          }}
        />
      </OverlayTrigger>
      {!formik.values.completed ? (
        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
          <FontAwesomeIcon
            className={`${styles["fontawesome-as-btn"]} mx-1`}
            color="green"
            icon={faEdit}
            onClick={() => isEditing || setEditing(true)}
          />
        </OverlayTrigger>
      ) : null}
      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
        <FontAwesomeIcon
          className={`${styles["fontawesome-as-btn"]} mx-1`}
          color="red"
          icon={faTrash}
          onClick={() => onDelete()}
        />
      </OverlayTrigger>
    </React.Fragment>
  );

  const renderEditForm = () => (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} lg={12}>
          <Form.Label>Title</Form.Label>
          <Form.Control
            id="title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group as={Col} lg={12}>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            id="description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          ></Form.Control>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} lg={6}>
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            id="dueDate"
            name="dueDate"
            onChange={(e) => formik.setFieldValue("dueDate", e.target.value)}
            value={convertToDateString(formik.values.dueDate)}
          ></Form.Control>
        </Form.Group>
        <Form.Group as={Col} lg={6}>
          <Form.Label>Priority</Form.Label>
          <Form.Control
            as="select"
            id="priority"
            name="priority"
            onChange={formik.handleChange}
            value={formik.values.priority}
          >
            {[...Array(10).keys()].map((v, i) => (
              <option key={i}>{v}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <div className="d-flex align-items-end justify-content-end">
        <span className="text-muted mr-auto d-none d-lg-block">
          Last modified: {new Date(Number(formik.values.modifiedDate)).toLocaleString("en-GB")}
        </span>
        <Button type="submit" className="mx-2">
          Done
        </Button>
        <Button
          type="reset"
          className="mx-2"
          variant="secondary"
          onClick={() => {
            setEditing(false);
            if (onCancel) {
              onCancel();
            }
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );

  const renderDisplayTask = () => (
    <Row>
      <Col lg={12}>
        <span className={`${styles["task-title-text"]}`}>{formik.values.title}</span>
      </Col>
      <Col lg={12}>
        <span className={`${styles["task-description-text"]}`}>{formik.values.description}</span>
      </Col>
      <Col lg={12}>
        <span className={`${styles["task-meta-text"]}`}>Priority: {formik.values.priority}</span>
      </Col>
      <Col lg={12} className={`${styles["task-meta-text"]}`}>
        <span>
          {!formik.values.dueDate
            ? ""
            : `Due: ${new Date(Number(formik.values.dueDate)).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}`}
        </span>
      </Col>
    </Row>
  );

  return (
    <Row
      className={`${
        isEditing ? styles["task-item-editing"] : styles["task-item"]
      } align-items-center`}
    >
      <Col lg={2} className="d-none d-lg-block text-center">
        {renderCheckBox()}
      </Col>
      <Col xs={12} className="d-lg-none d-block text-right">
        {renderCheckBox()}
        {renderStarEditDelete()}
        <hr />
      </Col>
      <Col xs={12} lg={8}>
        {isEditing ? renderEditForm() : renderDisplayTask()}
      </Col>
      <Col lg={2} className="d-none d-lg-block text-center">
        {renderStarEditDelete()}
      </Col>
    </Row>
  );
}
