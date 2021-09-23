import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";

import styles from "./views.module.css";
import Avatar from "../assets/images/avatar.svg";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../redux/slices/common/settings.js";
import { selectAuth } from "../redux/app/store.js";
import { verify, login, signup, resetCallbackState } from "../redux/slices/common/auth.js";
import ErrorBadge from "../components/ErrorBadge/ErrorBadge.jsx";

const Separator = () => {
  return (
    <div className="col-12 my-3 align-items-center d-flex">
      <div className={`${styles.borderTop}`}></div>
      <div className={`${styles.strongOr} mx-3`}>Or</div>
      <div className={`${styles.borderTop}`}></div>
    </div>
  );
};

export default function LoginPage(props) {
  const auth = useSelector(selectAuth);
  const history = useHistory();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      account: "",
      password: "",
    },
  });

  useEffect(() => {
    dispatch(verify());
    dispatch(setCurrentPage(undefined));
  }, []);

  useEffect(() => {
    if (auth.value.authenticated) {
      history.replace(auth.value.redirect);
    }
  }, [auth]);

  const handleLogin = () => {
    dispatch(login({ data: formik.values }));
  };

  const handleSignup = () => {
    dispatch(signup({ data: formik.values }));
  };

  return (
    <Container fluid className={`${styles.container}`}>
      <Row className={`${styles.row}`}>
        <Col lg={12} className="my-3 text-center">
          <img className={`${styles.avatar}`} src={Avatar} alt="Avatar" />
        </Col>
        <Form className="col-12 my-3" onSubmit={(e) => e.preventDefault()}>
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faUser} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                className={`${styles.input}`}
                type="text"
                placeholder="Account"
                name="account"
                id="account"
                onChange={formik.handleChange}
                value={formik.values.account}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faLock} />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                className={`${styles.input}`}
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </InputGroup>
          </Form.Group>
          {!auth.callbackState.success ? (
            <ErrorBadge
              className={"mx-0"}
              message={auth.callbackState.message}
              onClose={() => dispatch(resetCallbackState())}
            />
          ) : null}
          <Button className={`${styles["submit-btn"]}`} type="submit" onClick={() => handleLogin()}>
            <strong>Log In</strong>
          </Button>
          <Button
            className={`${styles["submit-btn"]}`}
            type="submit"
            onClick={() => handleSignup()}
          >
            <strong>Sign Up</strong>
          </Button>
        </Form>
        <Separator />
        <Col lg={12} className="text-center my-3">
          <Button className="mx-2">
            <FontAwesomeIcon icon={faGoogle} />
          </Button>
          <Button className="mx-2">
            <FontAwesomeIcon icon={faFacebook} />
          </Button>
          <Button className="mx-2">
            <FontAwesomeIcon icon={faGithub} />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
