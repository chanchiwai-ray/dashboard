import React, { useRef } from "react";

import { Modal, Form, Button } from "react-bootstrap";

export default function ModalForm({ title, fields, show, onHide, onPost, ...props }) {
  // use uncontrolled form to avoid expensive redenering
  const defaultFormData = {};
  fields.forEach((f) => {
    defaultFormData[f.name] = f.default || "";
  });

  const formData = useRef(defaultFormData);

  const onSubmit = (e) => {
    const submitData = {};
    fields.forEach((f) => {
      submitData[f.name] = formData.current[f.name].value;
    });
    if ("date" in submitData && submitData["date"] === "") {
      submitData["date"] = Date.now();
    } else if ("date" in submitData && submitData["date"] !== "") {
      submitData["date"] = Date.now(submitData["date"]);
    }
    onPost(submitData);
    onHide();
    e.preventDefault();
  };

  const onReset = (e) => {
    onHide();
  };

  const renderBody = () => {
    const body = fields.map((field) => {
      if (field.as === "select") {
        return (
          <Form.Group key={field.id}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              id={field.id}
              name={field.name}
              type={field.type}
              as={field.as}
              required={field.required}
              ref={(e) => (formData.current[field.name] = e)}
            >
              {field.choices.map((choice, index) => (
                <option key={index}>{choice.label}</option>
              ))}
            </Form.Control>
          </Form.Group>
        );
      }
      return (
        <Form.Group key={field.id}>
          <Form.Label>{field.label}</Form.Label>
          <Form.Control
            id={field.id}
            name={field.name}
            type={field.type}
            required={field.required}
            ref={(e) => (formData.current[field.name] = e)}
          />
        </Form.Group>
      );
    });
    return body;
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => onSubmit(e)}>
        <Modal.Body>{renderBody()}</Modal.Body>
        <Modal.Footer>
          <Button type="submit">Submit</Button>
          <Button onClick={() => onReset()} variant="secondary">
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
