import React, { useState } from "react";

import { Col, Card, Form, Button, Badge } from "react-bootstrap";

import { useFormik } from "formik";

import styles from "./CardContact.module.css";

export default function CardContact({ profile, putProfile }) {
  const [edit, setEdit] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstname: profile.firstname || "",
      lastname: profile.lastname || "",
      email: profile.email || "",
      mobile: profile.mobile || "",
      city: profile.city || "",
      address: profile.address || "",
      country: profile.country || "",
      zipcode: profile.zipcode || "",
      linkedin: profile.linkedin || "",
      github: profile.github || "",
      website: profile.website || "",
    },
    onSubmit: (values) => {
      putProfile(values);
      setEdit(!edit);
      e.preventDefault();
    },
    enableReinitialize: true,
  });

  return (
    <div>
      <Card className="card-formik.values">
        <Card.Header>
          <Card.Title>
            <span>
              Contact Information{" "}
              <Badge className="m-2" variant={edit ? "danger" : "success"}>
                {edit ? "Editing" : "Viewing"}
              </Badge>
            </span>
          </Card.Title>
        </Card.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Card.Body>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>First Name</Form.Label>
                {edit ? (
                  <Form.Control
                    id="firstname"
                    name="firstname"
                    type="text"
                    placeholder="First Name"
                    onChange={formik.handleChange}
                    value={formik.values.firstname}
                  />
                ) : (
                  <Form.Control
                    id="firstname"
                    name="firstname"
                    type="text"
                    placeholder="First Name"
                    value={formik.values.firstname}
                    readOnly
                  />
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>Last Name</Form.Label>
                {edit ? (
                  <Form.Control
                    id="lastname"
                    name="lastname"
                    type="text"
                    placeholder="Last Name"
                    onChange={formik.handleChange}
                    value={formik.values.lastname}
                  />
                ) : (
                  <Form.Control
                    id="lastname"
                    name="lastname"
                    type="text"
                    placeholder="Last Name"
                    value={formik.values.lastname}
                    readOnly
                  />
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>Email Address</Form.Label>
                {edit ? (
                  <Form.Control
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                ) : (
                  <Form.Control
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formik.values.email}
                    readOnly
                  />
                )}
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label className={`${styles["form-label"]}`}>Mobile Number</Form.Label>
                {edit ? (
                  <Form.Control
                    id="mobile"
                    name="mobile"
                    type="text"
                    placeholder="Mobile Number"
                    onChange={formik.handleChange}
                    value={formik.values.mobile}
                  />
                ) : (
                  <Form.Control
                    id="mobile"
                    name="mobile"
                    type="text"
                    placeholder="Mobile Number"
                    value={formik.values.mobile}
                    readOnly
                  />
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>Address</Form.Label>
                {edit ? (
                  <Form.Control
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Address"
                    onChange={formik.handleChange}
                    value={formik.values.address}
                  />
                ) : (
                  <Form.Control
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Address"
                    value={formik.values.address}
                    readOnly
                  />
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>City</Form.Label>
                {edit ? (
                  <Form.Control
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City Name"
                    onChange={formik.handleChange}
                    value={formik.values.city}
                  />
                ) : (
                  <Form.Control
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City Name"
                    value={formik.values.city}
                    readOnly
                  />
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>Country</Form.Label>
                {edit ? (
                  <Form.Control
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Country Name"
                    onChange={formik.handleChange}
                    value={formik.values.country}
                  />
                ) : (
                  <Form.Control
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Country Name"
                    value={formik.values.country}
                    readOnly
                  />
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>Zip Code</Form.Label>
                {edit ? (
                  <Form.Control
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    placeholder="Zip Code"
                    onChange={formik.handleChange}
                    value={formik.values.zipcode}
                  />
                ) : (
                  <Form.Control
                    id="zipcode"
                    name="zipcode"
                    type="texx"
                    placeholder="Zip Code"
                    value={formik.values.zipcode}
                    readOnly
                  />
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>LinkedIn</Form.Label>
                {edit ? (
                  <Form.Control
                    id="linkedin"
                    name="linkedin"
                    type="text"
                    placeholder="LinkedIn ID"
                    onChange={formik.handleChange}
                    value={formik.values.linkedin}
                  />
                ) : (
                  <Form.Control
                    id="linkedin"
                    name="linkedin"
                    type="text"
                    placeholder="LinkedIn ID"
                    value={formik.values.linkedin}
                    readOnly
                  />
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>GitHub</Form.Label>
                {edit ? (
                  <Form.Control
                    id="github"
                    name="github"
                    type="text"
                    placeholder="GitHub ID"
                    onChange={formik.handleChange}
                    value={formik.values.github}
                  />
                ) : (
                  <Form.Control
                    id="github"
                    name="github"
                    type="text"
                    placeholder="GitHub ID"
                    value={formik.values.github}
                    readOnly
                  />
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label className={`${styles["form-label"]}`}>Personal Website</Form.Label>
                {edit ? (
                  <Form.Control
                    id="website"
                    name="website"
                    type="text"
                    placeholder="Link to personal website"
                    onChange={formik.handleChange}
                    value={formik.values.website}
                  />
                ) : (
                  <Form.Control
                    id="website"
                    name="website"
                    type="text"
                    placeholder="Link to personal website"
                    value={formik.values.website}
                    readOnly
                  />
                )}
              </Form.Group>
            </Form.Row>
          </Card.Body>
          <Card.Footer className="text-center">
            {!edit ? (
              <Button className="m-2" onClick={() => setEdit(!edit)}>
                Edit Contact
              </Button>
            ) : (
              <div>
                <Button className={`m-2 ${styles["button"]}`} type="submit">
                  Save
                </Button>
                <Button
                  className={`m-2 ${styles["button"]}`}
                  variant="secondary"
                  onClick={() => {
                    setEdit(false);
                    formik.resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
