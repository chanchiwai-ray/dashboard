import React, { useEffect, useState } from "react";
import { Table, Form, Modal, Button } from "react-bootstrap";

export default function EditableTableForm({
  title,
  rows,
  fields,
  show,
  onHide,
  onUpdate,
  ...props
}) {
  const [records, setRecords] = useState({});

  useEffect(() => {
    const _records = {};
    rows.forEach((row) => {
      const date = new Date(Number(row.date));
      _records[row._id] = {
        ...row,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
          date.getDate()
        ).padStart(2, "0")}`,
      };
    });
    setRecords(_records);
  }, [rows]);

  const onChange = (id, target, value) => {
    setRecords({ ...records, [id]: { ...records[id], [target]: value } });
  };

  const onSubmit = (e) => {
    Object.values(records).forEach((record) => {
      const submitData = {};
      fields.forEach((f) => {
        submitData[f.name] = records[record._id][f.name];
      });
      if ("date" in submitData && submitData["date"] === "") {
        submitData["date"] = Date.now();
      } else if ("date" in submitData && submitData["date"] !== "") {
        submitData["date"] = Date.parse(submitData["date"]);
      }
      onUpdate(record._id, submitData);
    });
    onHide();
    e.preventDefault();
  };

  const onReset = (e) => {
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => onSubmit(e)}>
        <Modal.Body>
          <Table responsive striped bordered hover {...props}>
            <thead className="text-center">
              <tr>
                {fields.map((column, index) => (
                  <th style={{ width: Number(column.width) || "100px" }} key={index}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {Object.values(records).map((row) => (
                <tr key={row._id}>
                  {fields.map((column, index) => {
                    return (
                      <th key={index}>
                        {column.as === "select" ? (
                          <Form.Control
                            style={{ width: Number(column.width) || "100px" }}
                            as={column.as}
                            type={column.type}
                            value={row[column.name]}
                            required={column.required}
                            onChange={(e) => onChange(row._id, column.name, e.target.value)}
                          >
                            {column.choices.map((choice, index) => (
                              <option key={index}>{choice.label}</option>
                            ))}
                          </Form.Control>
                        ) : (
                          <Form.Control
                            style={{ width: Number(column.width) || "100px" }}
                            type={column.type}
                            value={row[column.name]}
                            required={column.required}
                            onChange={(e) => onChange(row._id, column.name, e.target.value)}
                          />
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
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
