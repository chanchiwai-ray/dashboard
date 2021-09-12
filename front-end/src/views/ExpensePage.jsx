import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Container, Row, Col, Nav, ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlusSquare, faListAlt, faEdit } from "@fortawesome/free-regular-svg-icons";

import ModalForm from "../components/ModalForm/ModalForm.jsx";
import Chart from "../redux/components/Chart.jsx";
import Controller from "../components/Controller/Controller.jsx";
import DataTable from "../redux/components/DataTable.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import EditableTableForm from "../redux/components/EditableTableForm.jsx";
import ErrorModal from "../components/ErrorModal/ErrorModal.jsx";

import { categoryFields, getRecordFields } from "../configs.jsx";
import { selectAuth, selectCategories } from "../redux/app/store.js";
import { deleteRecords, postRecords, putRecords } from "../redux/slices/finance/records.js";
import { deleteCategories, postCategories } from "../redux/slices/finance/categories.js";
import { setCurrentPage } from "../redux/slices/common/settings.js";

export default function ExpensePage({ ...props }) {
  const auth = useSelector(selectAuth);
  const categories = useSelector(selectCategories);
  const recordFields = getRecordFields();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    showRecordForm: false,
    showCategoryForm: false,
    showEditRecordForm: false,
    showErrorModal: false,
    selectedRowIds: new Set(),
  });

  useEffect(() => {
    dispatch(setCurrentPage("Expense"));
  }, []);

  const onDelete = (selectedRowIds) => {
    if (selectedRowIds.size === 0) {
      return setState({ ...state, showErrorModal: true });
    }

    selectedRowIds.forEach((id) => {
      dispatch(
        deleteRecords({
          userId: auth.value.userId,
          id: id,
        })
      );
    });

    setState({ ...state, setSelectedRowIds: new Set() });
  };

  const onUpdate = (selectedRowIds) => {
    if (selectedRowIds.size === 0) {
      return setState({ ...state, showErrorModal: true });
    }
    setState({ ...state, showEditRecordForm: true });
  };

  return (
    <MainLayout>
      <Controller title="Expense" bg="light" expand="lg">
        <Nav>
          <Nav.Link onClick={() => setState({ ...state, showCategoryForm: true })}>
            <FontAwesomeIcon className="fa-fw" icon={faListAlt} /> New Category
          </Nav.Link>
          <Nav.Link onClick={() => setState({ ...state, showRecordForm: true })}>
            <FontAwesomeIcon className="fa-fw" icon={faPlusSquare} /> Create
          </Nav.Link>
          <Nav.Link onClick={() => onUpdate(state.selectedRowIds)}>
            <FontAwesomeIcon className="fa-fw" icon={faEdit} /> Update
          </Nav.Link>
          <Nav.Link onClick={() => onDelete(state.selectedRowIds)}>
            <FontAwesomeIcon className="fa-fw" icon={faTrashAlt} /> Delete
          </Nav.Link>
        </Nav>
      </Controller>
      <Container>
        <Row>
          <Col sm={12}>
            <Chart categories={recordFields[1].choices} />
          </Col>
          <Col sm={12}>
            <DataTable
              selectedRowIds={state.selectedRowIds}
              setSelectedRowIds={(ids) => setState({ ...state, selectedRowIds: new Set(ids) })}
            />
          </Col>
        </Row>
      </Container>
      <ModalForm
        title="New Record"
        fields={recordFields}
        show={state.showRecordForm}
        onHide={() => setState({ ...state, showRecordForm: false })}
        onPost={(data) => {
          dispatch(
            postRecords({
              userId: auth.value.userId,
              data: data,
            })
          );
        }}
      />
      <EditableTableForm
        title="Update Record"
        size="sm"
        show={state.showEditRecordForm}
        fields={recordFields}
        selectedRowIds={state.selectedRowIds}
        onHide={() => setState({ ...state, showEditRecordForm: false })}
        onUpdate={(id, data) => {
          dispatch(
            putRecords({
              id: id,
              userId: auth.value.userId,
              data: data,
            })
          );
        }}
      />
      <ModalForm
        title="New Category"
        fields={categoryFields}
        show={state.showCategoryForm}
        onHide={() => setState({ ...state, showCategoryForm: false })}
        onPost={(data) => {
          dispatch(
            postCategories({
              userId: auth.value.userId,
              data: data,
            })
          );
        }}
      >
        <hr />
        <h6>Existing Categories</h6>
        <ListGroup>
          {categories.value.map((choice) => (
            <ListGroup.Item key={choice._id}>
              <div className="d-flex">
                <span className="mr-auto">{choice.label}</span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    dispatch(
                      deleteCategories({
                        userId: auth.value.userId,
                        id: choice._id,
                      })
                    );
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
        show={state.showErrorModal}
        onHide={() => setState({ ...state, showErrorModal: false })}
      >
        <p>You have not selected any records. Please choose at least one record from the table.</p>
      </ErrorModal>
    </MainLayout>
  );
}
