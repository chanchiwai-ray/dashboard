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
import {
  faSquare,
  faCheckSquare,
  faTimesCircle,
  faStar as faStarHollow,
} from "@fortawesome/free-regular-svg-icons";
import {
  faImage,
  faListAlt,
  faTrash,
  faEdit,
  faTag,
  faStar as faStarFilled,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import styles from "./Note.module.css";
import { getImageMimetype } from "../../utils";

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
    onEdit(updatedContent);
  };

  return (
    <ListGroup variant="flush">
      {content.map((item) => (
        <ListGroup.Item key={item.id}>
          <Row className="align-items-center">
            <Col xs={1} className="d-flex justify-content-center">
              <OverlayTrigger overlay={<Tooltip>{item.completed ? "Uncheck" : "Check"}</Tooltip>}>
                <FontAwesomeIcon
                  className={`${styles["fontawesome-as-btn"]}`}
                  icon={item.completed ? faCheckSquare : faSquare}
                  onClick={(e) => onChange(item.id, "completed", !item.completed)}
                />
              </OverlayTrigger>
            </Col>
            <Col sx={10} className="d-flex">
              {!isEditing ? (
                <span>{item.title}</span>
              ) : (
                <input
                  className="form-control"
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
                    className={`${styles["fontawesome-as-btn"]} mx-1`}
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
  const _id = uuid();
  const [isEditing, setEditing] = useState(props.edit);
  const [image, setImage] = useState(undefined);
  const formik = useFormik({
    initialValues: {
      star: item.star || false,
      title: item.title || "",
      labels: item.labels || [],
      description: item.description || "",
      listContent: item.listContent || [],
      imageContentId: item.imageContentId || undefined,
      modifiedDate: item.modifiedDate || Date.now(),
    },
    onSubmit: (values) => {
      const editedValues = { ...formik.values };
      editedValues.labels = formik.values.labels.filter((item) => item.label.trim() !== "");
      editedValues.listContent = formik.values.listContent.filter(
        (item) => item.title.trim() !== ""
      );
      editedValues.modifiedDate = Date.now();
      if (image !== undefined) editedValues.imageContentId = uuid();
      console.log(editedValues);
      setEditing(false);
      onDone(editedValues);
    },
    enableReinitialize: true,
  });

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file.slice(0, file.length));
    reader.onloadend = function (evt) {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result.slice(0, 4));
        let bytes = [];
        uint.forEach((byte) => {
          bytes.push(byte.toString(16));
        });
        const hex = bytes.join("").toUpperCase();

        const re = /^image/;
        if (re.test(getImageMimetype(hex))) {
          setImage(file);
        } else {
          setImage(undefined);
        }
      }
    };
  };
  const renderImage = () => {
    if (image) {
      return (
        <React.Fragment>
          <div className="d-flex justify-content-center py-3">
            <Card.Img src={URL.createObjectURL(new Blob([image]))} className={`${styles.image}`} />
          </div>
          <hr />
        </React.Fragment>
      );
    } else if (formik.values.imageContentId) {
      return (
        <React.Fragment>
          <div className="d-flex justify-content-center py-3">
            <Card.Img
              src={URL.createObjectURL(new Blob([formik.values.imageContentId]))}
              className={`${styles.image}`}
            />
          </div>
          <hr />
        </React.Fragment>
      );
    }
    return null;
  };

  const renderHeader = () => (
    <React.Fragment>
      <div className="d-flex ">
        <div className="mr-auto">
          <FontAwesomeIcon icon={faTag} color="grey" className="fa-fw mr-1" size="sm" />
          {formik.values.labels
            ? formik.values.labels.map((label) => (
                <Badge key={label.id} className="m-1" pill variant="primary">
                  {isEditing ? (
                    <input
                      className="mx-1"
                      style={{ width: "5rem" }}
                      value={formik.values.labels.find((l) => l.id === label.id).label}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "labels",
                          formik.values.labels.map((l) => {
                            if (l.id === label.id) {
                              const newLabel = { ...l };
                              newLabel.label = e.target.value;
                              return newLabel;
                            } else {
                              return l;
                            }
                          })
                        )
                      }
                    />
                  ) : (
                    <span className="m-1">{label.label}</span>
                  )}
                  <OverlayTrigger key={label.id} overlay={<Tooltip>Click to delete</Tooltip>}>
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      color="black"
                      onClick={() => {
                        formik.setFieldValue(
                          "labels",
                          formik.values.labels.filter((l) => l.id !== label.id)
                        );
                        if (!isEditing) {
                          formik.handleSubmit();
                        }
                      }}
                    />
                  </OverlayTrigger>
                </Badge>
              ))
            : null}
        </div>
        <div>
          <OverlayTrigger overlay={<Tooltip>{formik.values.star ? "Unstar" : "Star"}</Tooltip>}>
            <FontAwesomeIcon
              className={`${styles["fontawesome-as-btn"]} mx-1`}
              color="#ff55f2"
              icon={formik.values.star ? faStarFilled : faStarHollow}
              onClick={(e) => {
                formik.setFieldValue("star", !formik.values.star);
                if (!isEditing) {
                  formik.handleSubmit();
                }
              }}
            />
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
            <FontAwesomeIcon
              className={`${styles["fontawesome-as-btn"]} mx-1`}
              color="green"
              icon={faEdit}
              onClick={(e) => {
                isEditing || setEditing(!isEditing);
              }}
            />
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
            <FontAwesomeIcon
              className={`${styles["fontawesome-as-btn"]} mx-1`}
              color="red"
              icon={faTrash}
              onClick={(e) => {
                onDelete();
              }}
            />
          </OverlayTrigger>
        </div>
      </div>
    </React.Fragment>
  );

  const renderBody = () => (
    <React.Fragment>
      {renderImage()}
      <Card.Title>
        {isEditing ? (
          <input
            className="form-control"
            id="title"
            name="title"
            placeholder="Note Title"
            onChange={formik.handleChange}
            value={formik.values.title}
            required
          />
        ) : (
          formik.values.title
        )}
      </Card.Title>
      <Card.Text>
        {isEditing ? (
          <textarea
            className="form-control"
            id="description"
            name="description"
            placeholder="Description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
        ) : (
          formik.values.description
        )}
      </Card.Text>
    </React.Fragment>
  );

  const renderFooter = () => (
    <React.Fragment>
      {!isEditing ? (
        <span className="ml-auto">{`Last modified: ${
          new Date(Number(formik.values.modifiedDate)).toLocaleString("en-GB") || ""
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
            <div>
              <label
                htmlFor={`file-upload-${_id}`}
                className={`${styles.label} btn btn-outline-warning`}
              >
                <FontAwesomeIcon icon={faImage} />
              </label>
              <input
                id={`file-upload-${_id}`}
                className={`${styles.input}`}
                type="file"
                onChange={(e) => onFileChange(e)}
                accept="image/*"
              />
            </div>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Add Label</Tooltip>}>
            <InputGroup.Text
              className="btn btn-outline-info mx-1"
              onClick={() => {
                formik.setFieldValue("labels", [
                  ...formik.values.labels,
                  { id: uuid(), label: "" },
                ]);
              }}
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
    </React.Fragment>
  );

  const renderList = () =>
    formik.values.listContent && formik.values.listContent.length !== 0 ? (
      <CheckList
        content={formik.values.listContent}
        onDone={() => formik.handleSubmit()}
        onEdit={(newContent) => formik.setFieldValue("listContent", newContent)}
        isEditing={isEditing}
      />
    ) : null;

  return (
    <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
      <Card>
        <Card.Header>{renderHeader()}</Card.Header>
        <Card.Body>{renderBody()}</Card.Body>
        {renderList()}
        <Card.Footer className="text-muted d-flex">{renderFooter()}</Card.Footer>
      </Card>
    </Form>
  );
}
