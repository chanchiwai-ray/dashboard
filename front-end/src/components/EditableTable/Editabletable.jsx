import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";

export default function EditableTable({ rows, fields, columns, ...props }) {
  const [records, setRecords] = useState({});

  useEffect(() => {
    const _records = {};
    rows.forEach((row) => {
      _records[row._id] = row;
    });
    setRecords(_records);
  }, [rows]);

  const onChange = (id, target, value) => {
    setRecords({ ...records, [id]: { ...records[id], [target]: value } });
  };

  return (
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
  );
}
