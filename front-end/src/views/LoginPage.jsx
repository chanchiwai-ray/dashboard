import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";

import styles from "./views.module.css";
import Avatar from "../assets/images/avatar.svg";
import { useAuth } from "../authenticate.jsx";
import ErrorModal from "../components/ErrorModal/ErrorModal.jsx";

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
  const auth = useAuth();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      account: "",
      password: "",
    },
  });
  const [error, setError] = useState({ title: "Error", message: "An error occurs.", show: false });

  // verify the cookies and redirect to homepage without logging in again if the
  // user has valid cookies.
  useEffect(() => {
    auth.verifySession(() => {
      history.replace("/home");
    }, null);
  }, []);

  const handleLogin = () => {
    auth.login(
      formik.values,
      (res) => {
        setError({ title: "", message: "", show: false });
        history.replace("/home");
      },
      (res) => {
        setError({ title: "Error", message: res.message, show: true });
      }
    );
  };

  const handleSignup = () => {
    auth.signup(
      formik.values,
      (res) => {
        setError({ title: "", message: "", show: false });
        history.replace("/home");
      },
      (res) => {
        setError({ title: "Error", message: res.message, show: true });
      }
    );
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className="row">
        <div className="col-12 my-3 text-center">
          <img className={`${styles.avatar}`} src={Avatar} alt="Avatar" />
        </div>
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
        <div className="col-12 text-center my-3">
          <Button className="mx-2">
            <FontAwesomeIcon icon={faGoogle} />
          </Button>
          <Button className="mx-2">
            <FontAwesomeIcon icon={faFacebook} />
          </Button>
          <Button className="mx-2">
            <FontAwesomeIcon icon={faGithub} />
          </Button>
        </div>
        <ErrorModal
          title={error.title}
          show={error.show}
          onHide={() => setError({ ...error, show: false })}
        >
          <p>{error.message}</p>
        </ErrorModal>
      </div>
    </div>
  );
}
