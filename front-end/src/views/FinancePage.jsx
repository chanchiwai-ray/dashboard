import React, { useContext, useEffect, useState } from "react";

import { Container, Row, Col, Nav, ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faPlusSquare,
  faCreditCard,
  faListAlt,
} from "@fortawesome/free-regular-svg-icons";

import ModalForm from "../components/ModalForm/ModalForm.jsx";
import Chart from "../components/Chart/Chart.jsx";
import Controller from "../components/Controller/Controller.jsx";
import DataTable from "../components/DataTable/DataTable.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

import Context from "../contexts.jsx";
import { useAuthFetch } from "../utils.jsx";
import { columns, categoryFields, accountFields, recordFields } from "../configs.jsx";

export default function FinancePage({ ...props }) {
  const [recordState, recordAction] = useAuthFetch("finances", "records");
  const [accountState, accountAction] = useAuthFetch("finances", "accounts");
  const [categoryState, categoryAction] = useAuthFetch("finances", "categories");
  const [showRecordForm, setDisplayRecordForm] = useState(false);
  const [showAccountForm, setDisplayAccountForm] = useState(false);
  const [showCategoryForm, setDisplayCategoryForm] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [filterString, setFilterString] = useState("");

  const context = useContext(Context);
  useEffect(() => {
    context.updatePage("Finance");
  }, []);

  useEffect(() => {
    let categoryField = recordFields.filter((field) => field.id === 2)[0];
    let accountField = recordFields.filter((field) => field.id === 3)[0];
    if (categoryState.success) {
      categoryField.choices = categoryState.payload;
    }
    if (accountState.success) {
      accountField.choices = [accountField.default, ...accountState.payload];
    }
  }, [categoryState, accountState]);

  const onDelete = () => {
    selectedRowIds.forEach((id) => {
      recordAction.delete()(id);
    });
    setSelectedRowIds(new Set());
  };

  return (
    <MainLayout>
      <Controller title="Finance" bg="light" expand="lg">
        <Nav.Link onClick={() => setDisplayAccountForm(true)}>
          <FontAwesomeIcon className="fa-fw" icon={faCreditCard} /> New Account
        </Nav.Link>
        <Nav.Link onClick={() => setDisplayCategoryForm(true)}>
          <FontAwesomeIcon className="fa-fw" icon={faListAlt} /> New Category
        </Nav.Link>
        <Nav.Link onClick={() => setDisplayRecordForm(true)}>
          <FontAwesomeIcon className="fa-fw" icon={faPlusSquare} /> Create
        </Nav.Link>
        <Nav.Link onClick={() => onDelete(selectedRowIds)}>
          <FontAwesomeIcon className="fa-fw" icon={faTrashAlt} /> Delete
        </Nav.Link>
      </Controller>
      <Container>
        <Row>
          <Col sm={12}>
            {<Chart records={recordState.payload} categories={categoryState.payload} />}
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
        onDelete={recordAction.delete()}
      />
      <ModalForm
        title="New Account"
        fields={accountFields}
        show={showAccountForm}
        onHide={() => setDisplayAccountForm(false)}
        onPost={accountAction.create()}
        onDelete={accountAction.delete()}
      >
        <hr />
        <h6>Existing Accounts</h6>
        <ListGroup>
          {accountState.payload.map((choice) => (
            <ListGroup.Item key={choice._id}>
              <div className="d-flex">
                <span className="mr-auto">{choice.label}</span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => accountAction.delete()(choice._id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </ModalForm>
      <ModalForm
        title="New Category"
        fields={categoryFields}
        show={showCategoryForm}
        onHide={() => setDisplayCategoryForm(false)}
        onPost={categoryAction.create()}
        onDelete={categoryAction.delete()}
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
    </MainLayout>
  );
}
