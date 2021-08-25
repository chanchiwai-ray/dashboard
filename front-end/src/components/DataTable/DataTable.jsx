import React, { useState } from "react";

import { Row, Col } from "react-bootstrap";
import { Table } from "react-bootstrap";
import AutoPagintaion from "../AutoPagination/AutoPagination.jsx";

import styles from "./DataTable.module.css";

// FIXME: don't fetch all data at once
export default function DataTable({
  rows,
  columns,
  filterString,
  setFilterString,
  selectedRowIds,
  setSelectedRowIds,
  ...props
}) {
  const [page, setPage] = useState(1);
  const [numOfRows, setNumOfRow] = useState(10);
  const [isAllVisibleRowsChecked, checkAllVisibleRows] = useState(false);

  const toggleRowState = (id) => {
    if (selectedRowIds.has(id)) {
      selectedRowIds.delete(id);
      setSelectedRowIds(new Set(selectedRowIds));
    } else {
      selectedRowIds.add(id);
      setSelectedRowIds(new Set(selectedRowIds));
    }
  };

  const setAllVisibleRowsState = (state) => {
    const ids = rows.slice((page - 1) * numOfRows, page * numOfRows).map((r) => r._id);
    if (state) {
      setSelectedRowIds(new Set(ids));
    } else {
      setSelectedRowIds([]);
    }
    checkAllVisibleRows(state);
  };

  const toPage = (page) => {
    setAllVisibleRowsState(false);
    setPage(page);
  };

  const toPrevPage = () => {
    setAllVisibleRowsState(false);
    setPage((currPage) => (currPage == 1 ? 1 : currPage - 1));
  };

  const toNextPage = () => {
    setAllVisibleRowsState(false);
    setPage((currPage) =>
      currPage == Math.ceil(rows.length / numOfRows)
        ? Math.ceil(rows.length / numOfRows)
        : currPage + 1
    );
  };

  return (
    <Row>
      <Col sm={12} className="my-3">
        <input
          className={`${styles["filter-box"]}`}
          placeholder="Filter By Description"
          value={filterString}
          onChange={(e) => setFilterString(e.target.value)}
        />
      </Col>
      <Col sm={12} className="text-right">
        <span className="text-muted">
          Displaying {(page - 1) * numOfRows + 1} - {page * numOfRows} in total of {rows.length}
        </span>
        <select className="ml-2" id="display-rows">
          <option onClick={() => setNumOfRow(10)}>10 rows</option>
          <option onClick={() => setNumOfRow(30)}>30 rows</option>
          <option onClick={() => setNumOfRow(50)}>50 rows</option>
          <option onClick={() => setNumOfRow(100)}>100 rows</option>
        </select>
      </Col>
      <Col sm={12} className="my-3">
        <Table responsive striped bordered hover size="sm" className="m-0">
          <thead className="text-center">
            <tr>
              <th style={{ width: "10px" }}>
                <input
                  type="checkbox"
                  name="isAllVisibleRowsChecked"
                  checked={isAllVisibleRowsChecked}
                  onChange={() => setAllVisibleRowsState(!isAllVisibleRowsChecked)}
                />
              </th>
              {columns.map((column, index) => (
                <th style={{ width: Number(column.width) || "100px" }} key={index}>
                  {column.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {rows.slice((page - 1) * numOfRows, page * numOfRows).map((row) => (
              <tr key={row._id}>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRowIds.has(row._id)}
                    onChange={() => toggleRowState(row._id)}
                  />
                </th>
                {columns.map((column, index) => (
                  <th style={{ width: Number(column.width) || "100px" }} key={index}>
                    {column.field === "date"
                      ? new Date(Number(row[column.field])).toLocaleDateString()
                      : row[column.field]}
                  </th>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
      <Col sm={12} className="d-flex justify-content-center my-3">
        <AutoPagintaion
          totalPages={rows.length}
          currPage={page}
          toPage={toPage}
          toNextPage={toNextPage}
          toPrevPage={toPrevPage}
          maxLeftPages={2}
          maxRightPages={2}
        />
      </Col>
    </Row>
  );
}
