import React, { useState } from "react";
import { useFormik } from "formik";

import { Button, Card, Form, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser, faStar as faStarFilled } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarHollow } from "@fortawesome/free-regular-svg-icons";

import styles from "./Contact.module.css";

const Contact = ({
  star,
  firstname,
  lastname,
  mobile,
  email,
  address,
  onDone,
  onDelete,
  onCancel,
  ...props
}) => {
  const [edit, enableEdit] = useState(props.edit);
  const formik = useFormik({
    initialValues: {
      star: star || false,
      firstname: firstname || "",
      lastname: lastname || "",
      mobile: mobile || "",
      email: email || "",
      address: address || "",
    },
    onSubmit: (values) => {
      // PUT request
      enableEdit(false);
      onDone(values);
    },
    onReset: (values) => {
      enableEdit(false);
      values = formik.initialValues;
    },
    enableReinitialize: true,
  });

  const renderHeader = () => (
    <React.Fragment>
      <div>
        <FontAwesomeIcon icon={faUser} color="#777" className="mx-1" />{" "}
        <span className="font-weight-bold">{`${formik.values.firstname} ${formik.values.lastname}`}</span>
      </div>
      <div className="ml-auto">
        <OverlayTrigger overlay={<Tooltip>{formik.values.star ? "Unstar" : "Star"}</Tooltip>}>
          <FontAwesomeIcon
            className={`${styles["fontawesome-as-btn"]} mx-1`}
            color="#ff55f2"
            icon={formik.values.star ? faStarFilled : faStarHollow}
            onClick={(e) => {
              formik.setFieldValue("star", !formik.values.star);
              if (!edit) {
                formik.handleSubmit();
              }
            }}
          />
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
          <FontAwesomeIcon
            icon={faEdit}
            color="green"
            className={`${styles["fontawesome-as-btn"]} mx-2`}
            onClick={() => edit || enableEdit(!edit)}
          />
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
          <FontAwesomeIcon
            icon={faTrash}
            color="red"
            className={`${styles["fontawesome-as-btn"]} mx-2`}
            onClick={() => onDelete()}
          />
        </OverlayTrigger>
      </div>
    </React.Fragment>
  );

  const renderBody = () => (
    <React.Fragment>
      <Form.Row>
        <Form.Label column lg={3}>
          First Name
        </Form.Label>
        <Col>
          <Form.Control
            id="firstname"
            name="firstname"
            type="string"
            onChange={formik.handleChange}
            value={formik.values.firstname}
            readOnly={!edit}
            required
          />
        </Col>
      </Form.Row>
      <br />
      <Form.Row>
        <Form.Label column lg={3}>
          Last Name
        </Form.Label>
        <Col>
          <Form.Control
            id="lastname"
            name="lastname"
            type="string"
            onChange={formik.handleChange}
            value={formik.values.lastname}
            readOnly={!edit}
            required
          />
        </Col>
      </Form.Row>
      <br />
      <Form.Row>
        <Form.Label column lg={3}>
          Mobile
        </Form.Label>
        <Col>
          <Form.Control
            id="mobile"
            name="mobile"
            type="string"
            onChange={formik.handleChange}
            value={formik.values.mobile}
            readOnly={!edit}
            required
          />
        </Col>
      </Form.Row>
      <br />
      <Form.Row>
        <Form.Label column lg={3}>
          Email
        </Form.Label>
        <Col>
          <Form.Control
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            readOnly={!edit}
          />
        </Col>
      </Form.Row>
      <br />
      <Form.Row>
        <Form.Label column lg={3}>
          Address
        </Form.Label>
        <Col>
          <Form.Control
            id="address"
            name="address"
            onChange={formik.handleChange}
            value={formik.values.address}
            placeholder="(optional)"
            readOnly={!edit}
          />
        </Col>
      </Form.Row>
    </React.Fragment>
  );

  const renderFooter = () =>
    !edit ? null : (
      <React.Fragment>
        <Button type="submit" className="mx-2">
          Save
        </Button>
        <Button
          className="mx-2"
          onClick={() => {
            enableEdit(false);
            formik.resetForm();
            if (onCancel) {
              onCancel();
            }
          }}
        >
          Cancel
        </Button>
      </React.Fragment>
    );

  return (
    <Card>
      <Card.Header className="d-flex">{renderHeader()}</Card.Header>
      <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <Card.Body>{renderBody()}</Card.Body>
        <Card.Footer className="text-center">{renderFooter()}</Card.Footer>
      </Form>
    </Card>
  );
};

export default Contact;
