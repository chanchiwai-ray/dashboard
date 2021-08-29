import React, { useContext, useEffect, useState } from "react";

import { Container, Row, Col, Nav, ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlusSquare, faListAlt, faEdit } from "@fortawesome/free-regular-svg-icons";

import ModalForm from "../components/ModalForm/ModalForm.jsx";
import Chart from "../components/Chart/Chart.jsx";
import Controller from "../components/Controller/Controller.jsx";
import DataTable from "../components/DataTable/DataTable.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

import Context from "../contexts.jsx";
import { useAuthFetch, useDates } from "../utils.jsx";
import { columns, categoryFields, recordFields } from "../configs.jsx";
import EditableTableForm from "../components/EditableTableForm/Editabletable.jsx";
import ErrorModal from "../components/ErrorModal/ErrorModal.jsx";

const date = new Date();
const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

export default function ExpensePage({ ...props }) {
  const [dates, dateAction] = useDates(new Date());
  const [recordState, recordAction] = useAuthFetch("finances", "records", {
    start: Date.parse(dates[0] || startDate),
    end: Date.parse(dates[dates.length - 1] || endDate),
  });
  const [categoryState, categoryAction] = useAuthFetch("finances", "categories");
  const [showRecordForm, setDisplayRecordForm] = useState(false);
  const [showCategoryForm, setDisplayCategoryForm] = useState(false);
  const [showEditRecordForm, setDisplayEditRecordForm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [filterString, setFilterString] = useState("");

  const context = useContext(Context);
  useEffect(() => {
    context.updatePage("Expense");
  }, []);

  useEffect(() => {
    recordAction.reload({
      start: Date.parse(dates[0] || startDate),
      end: Date.parse(dates[dates.length - 1] || endDate),
    });
  }, [dates]);

  useEffect(() => {
    let categoryField = recordFields.filter((field) => field.id === 2)[0];
    if (categoryState.success) {
      categoryField.choices = categoryState.payload;
    }
  }, [categoryState]);

  const onDelete = (selectedRowIds) => {
    if (selectedRowIds.size === 0) {
      return setShowErrorModal(true);
    }

    selectedRowIds.forEach((id) => {
      recordAction.delete()(id);
    });
    setSelectedRowIds(new Set());
  };

  const onUpdate = (selectedRowIds) => {
    if (selectedRowIds.size === 0) {
      return setShowErrorModal(true);
    }
    setDisplayEditRecordForm(true);
  };

  return (
    <MainLayout>
      <Controller title="Expense" bg="light" expand="lg">
        <Nav.Link onClick={() => setDisplayCategoryForm(true)}>
          <FontAwesomeIcon className="fa-fw" icon={faListAlt} /> New Category
        </Nav.Link>
        <Nav.Link onClick={() => setDisplayRecordForm(true)}>
          <FontAwesomeIcon className="fa-fw" icon={faPlusSquare} /> Create
        </Nav.Link>
        <Nav.Link onClick={() => onUpdate(selectedRowIds)}>
          <FontAwesomeIcon className="fa-fw" icon={faEdit} /> Update
        </Nav.Link>
        <Nav.Link onClick={() => onDelete(selectedRowIds)}>
          <FontAwesomeIcon className="fa-fw" icon={faTrashAlt} /> Delete
        </Nav.Link>
      </Controller>
      <Container>
        <Row>
          <Col sm={12}>
            {
              <Chart
                dates={dates}
                records={recordState.payload}
                categories={categoryState.payload}
                dateAction={dateAction}
              />
            }
          </Col>
          <Col sm={12}>
            <DataTable
              rows={recordState.payload.filter((row) =>
                filterString !== "" ? row.description.includes(filterString) : true
              )}
              columns={columns}
              selectedRowIds={selectedRowIds}
              filterString={filterString}
              setFilterString={setFilterString}
              setSelectedRowIds={(ids) => setSelectedRowIds(new Set(ids))}
            />
          </Col>
        </Row>
      </Container>
      <ModalForm
        title="New Record"
        fields={recordFields}
        show={showRecordForm}
        onHide={() => setDisplayRecordForm(false)}
        onPost={recordAction.create()}
      />
      <EditableTableForm
        title="Update Record"
        size="sm"
        rows={recordState.payload.filter((record) => selectedRowIds.has(record._id))}
        fields={recordFields}
        show={showEditRecordForm}
        onHide={() => setDisplayEditRecordForm(false)}
        onUpdate={recordAction.update()}
      />
      <ModalForm
        title="New Category"
        fields={categoryFields}
        show={showCategoryForm}
        onHide={() => setDisplayCategoryForm(false)}
        onPost={categoryAction.create()}
      >
        <hr />
        <h6>Existing Categories</h6>
        <ListGroup>
          {categoryState.payload.map((choice) => (
            <ListGroup.Item key={choice._id}>
              <div className="d-flex">
                <span className="mr-auto">{choice.label}</span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => categoryAction.delete()(choice._id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </ModalForm>
      <ErrorModal
        title="Invaild Operation"
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
      >
        <p>You have not selected any records. Please choose at least one record from the table.</p>
      </ErrorModal>
    </MainLayout>
  );
}
