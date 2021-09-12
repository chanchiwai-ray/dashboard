import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useFormik } from "formik";

import { Button, Card, Form, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

const Contact = ({ firstname, lastname, mobile, email, address, ...props }) => {
  const [edit, enableEdit] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstname: firstname || "",
      lastname: lastname || "",
      mobile: mobile || "",
      email: email || "",
      address: address || "",
    },
    onSubmit: (values) => {
      // PUT request
      enableEdit(false);
      props.update(values);
    },
    onReset: (values) => {
      enableEdit(false);
      values = formik.initialValues;
    },
  });
  return (
    <Card>
      <Card.Header className="d-flex">
        <div>
          <FontAwesomeIcon icon={faUser} className="mx-1" />{" "}
          {`${formik.values.firstname} ${formik.values.lastname}`}
        </div>
        <div className="ml-auto">
          <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
            <FontAwesomeIcon icon={faEdit} className="mx-2" onClick={() => enableEdit(!edit)} />
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
            <FontAwesomeIcon icon={faTrash} className="mx-2" onClick={() => props.delete()} />
          </OverlayTrigger>
        </div>
      </Card.Header>
      <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <Card.Body>
          <Form.Row>
            <Form.Label column lg={3}>
              First Name
            </Form.Label>
            <Col>
              {edit ? (
                <Form.Control
                  id="firstname"
                  name="firstname"
                  onChange={formik.handleChange}
                  value={formik.values.firstname}
                ></Form.Control>
              ) : (
                <Form.Control
                  id="firstname"
                  name="firstname"
                  onChange={formik.handleChange}
                  value={formik.values.firstname}
                  readOnly
                ></Form.Control>
              )}
            </Col>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Label column lg={3}>
              Last Name
            </Form.Label>
            <Col>
              {edit ? (
                <Form.Control
                  id="lastname"
                  name="lastname"
                  onChange={formik.handleChange}
                  value={formik.values.lastname}
                ></Form.Control>
              ) : (
                <Form.Control
                  id="lastname"
                  name="lastname"
                  onChange={formik.handleChange}
                  value={formik.values.lastname}
                  readOnly
                ></Form.Control>
              )}
            </Col>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Label column lg={3}>
              Mobile
            </Form.Label>
            <Col>
              {edit ? (
                <Form.Control
                  id="mobile"
                  name="mobile"
                  onChange={formik.handleChange}
                  value={formik.values.mobile}
                ></Form.Control>
              ) : (
                <Form.Control
                  id="mobile"
                  name="mobile"
                  onChange={formik.handleChange}
                  value={formik.values.mobile}
                  readOnly
                ></Form.Control>
              )}
            </Col>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Label column lg={3}>
              Email
            </Form.Label>
            <Col>
              {edit ? (
                <Form.Control
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                ></Form.Control>
              ) : (
                <Form.Control
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  readOnly
                ></Form.Control>
              )}
            </Col>
          </Form.Row>
          <br />
          <Form.Row>
            <Form.Label column lg={3}>
              Address
            </Form.Label>
            <Col>
              {edit ? (
                <Form.Control
                  id="address"
                  name="address"
                  onChange={formik.handleChange}
                  value={formik.values.address}
                  placeholder="(optional)"
                ></Form.Control>
              ) : (
                <Form.Control
                  id="address"
                  name="address"
                  onChange={formik.handleChange}
                  value={formik.values.address}
                  placeholder="(optional)"
                  readOnly
                ></Form.Control>
              )}
            </Col>
          </Form.Row>
        </Card.Body>
        {edit ? (
          <Card.Footer className="text-center">
            <Button type="submit" className="mx-2">
              Save
            </Button>
            <Button type="reset" className="mx-2">
              Cancel
            </Button>
          </Card.Footer>
        ) : (
          <div></div>
        )}
      </Form>
    </Card>
  );
};

export default Contact;
