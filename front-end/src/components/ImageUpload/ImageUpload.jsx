import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { getImageMimetype } from "../../utils";
import styles from "./ImageUpload.module.css";

export default function ({ show, onHide, setFormData, ...props }) {
  const [state, setState] = useState({ success: false, message: "(Select a picture to upload.)" });
  const [file, setFile] = useState(undefined);
  const [buffer, setBuffer] = useState(undefined);
  const [thumbnail, setThumbnail] = useState(undefined);

  const onChange = (e) => {
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
          const dataURL = URL.createObjectURL(new Blob([evt.target.result]));
          setState({ success: true, message: "" });
          setFile(file);
          setBuffer(evt.target.result);
          setThumbnail(dataURL);
        } else {
          setState({
            success: false,
            message: "(Error: only .jpg, .jpeg, .png, .gif are supported.)",
          });
          setFile(undefined);
          setBuffer(undefined);
          setThumbnail(undefined);
        }
      }
    };
  };

  const onReset = () => {
    setState({ success: false, message: "(Select a picture to upload.)" });
    setFile(undefined);
    setBuffer(undefined);
    setThumbnail(undefined);
    onHide();
  };

  return (
    <Modal show={show} onHide={() => onReset()}>
      <Modal.Header closeButton>
        <Modal.Title>Upload an image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {state.success ? (
          <div
            className="d-flex align-item-center pb-3"
            style={{ width: "100%", maxHeight: "700px" }}
          >
            <img className={`${styles.thumbnail}`} src={thumbnail} alt="Thumbnail" />
          </div>
        ) : (
          <p className="text-muted">{state.message}</p>
        )}
        <input
          className={`${styles.input}`}
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setFormData(file);
            onHide();
          }}
        >
          Done
        </Button>
        <Button onClick={() => onReset()} variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
