import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Container, Row, Col, Nav, ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlusSquare, faListAlt, faEdit } from "@fortawesome/free-regular-svg-icons";

import ModalForm from "../components/ModalForm/ModalForm.jsx";
import Chart from "../components/Chart/Chart.jsx";
import Controller from "../components/Controller/Controller.jsx";
import DataTable from "../components/DataTable/DataTable.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

import Context from "../contexts.jsx";
import { useDates } from "../utils.jsx";
import { columns, categoryFields, getRecordFields } from "../configs.jsx";
import EditableTableForm from "../components/EditableTableForm/Editabletable.jsx";
import ErrorModal from "../components/ErrorModal/ErrorModal.jsx";
import { selectRecords } from "../redux/app/store.js";
import {
  deleteRecords,
  getDailyRecords,
  getRecords,
  postRecords,
  putRecords,
} from "../redux/slices/finance/records.js";
import {
  deleteCategories,
  getCategories,
  postCategories,
} from "../redux/slices/finance/categories.js";
import { useAuth } from "../authenticate.jsx";

const date = new Date();
const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

export default function ExpensePage({ ...props }) {
  const auth = useAuth();
  const [reload, setReload] = useState(false);
  const dispatch = useDispatch();
  const records = useSelector(selectRecords);
  const recordFields = getRecordFields();
  const categories = recordFields[1].choices;
  const [dates, dateAction] = useDates(new Date());

  const context = useContext(Context);
  useEffect(() => {
    auth.verifySession();
    context.updatePage("Expense");
  }, []);

  useEffect(() => {
    if (dates.length > 0 && auth.userId) {
      dispatch(
        getRecords({
          userId: auth.userId,
          query: {
            start: Date.parse(dates[0] || startDate),
            end: Date.parse(dates[dates.length - 1]) || endDate,
          },
        })
      );
      dispatch(
        getDailyRecords({
          userId: auth.userId,
          query: {
            start: Date.parse(dates[0] || startDate),
            end: Date.parse(dates[dates.length - 1]) || endDate,
          },
        })
      );
    }
  }, [dates, auth]);

  useEffect(() => {
    if (reload) {
      dispatch(
        getRecords({
          userId: auth.userId,
          query: {
            start: Date.parse(dates[0] || startDate),
            end: Date.parse(dates[dates.length - 1]) || endDate,
          },
        })
      );
      dispatch(
        getDailyRecords({
          userId: auth.userId,
          query: {
            start: Date.parse(dates[0] || startDate),
            end: Date.parse(dates[dates.length - 1]) || endDate,
          },
        })
      );
      setReload(false);
    }
  }, [reload]);

  const [showRecordForm, setDisplayRecordForm] = useState(false);
  const [showCategoryForm, setDisplayCategoryForm] = useState(false);
  const [showEditRecordForm, setDisplayEditRecordForm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  const onDelete = (selectedRowIds) => {
    if (selectedRowIds.size === 0) {
      return setShowErrorModal(true);
    }

    selectedRowIds.forEach((id) => {
      dispatch(
        deleteRecords({
          userId: auth.userId,
          id: id,
        })
      );
    });

    setReload(true);
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
            {records.success ? (
              <Chart
                dates={dates}
                records={records.value.dailyRecords}
                categories={categories}
                dateAction={dateAction}
              />
            ) : (
              <h1>{records.message}</h1>
            )}
          </Col>
          <Col sm={12}>
            <DataTable
              rows={records.value.records}
              columns={columns}
              selectedRowIds={selectedRowIds}
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
        onPost={(data) => {
          dispatch(
            postRecords({
              userId: auth.userId,
              data: data,
            })
          );
          setReload(true);
        }}
      />
      <EditableTableForm
        title="Update Record"
        size="sm"
        rows={records.value.records.filter((record) => selectedRowIds.has(record._id))}
        fields={recordFields}
        show={showEditRecordForm}
        onHide={() => setDisplayEditRecordForm(false)}
        onUpdate={(id, data) => {
          dispatch(
            putRecords({
              id: id,
              userId: auth.userId,
              data: data,
            })
          );
          setReload(true);
        }}
      />
      <ModalForm
        title="New Category"
        fields={categoryFields}
        show={showCategoryForm}
        onHide={() => setDisplayCategoryForm(false)}
        onPost={(data) => {
          dispatch(
            postCategories({
              userId: auth.userId,
              data: data,
            })
          );
          setReload(true);
        }}
      >
        <hr />
        <h6>Existing Categories</h6>
        <ListGroup>
          {categories.map((choice) => (
            <ListGroup.Item key={choice._id}>
              <div className="d-flex">
                <span className="mr-auto">{choice.label}</span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    dispatch(
                      deleteCategories({
                        userId: auth.userId,
                        id: choice._id,
                      })
                    );
                    setReload(true);
                  }}
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
