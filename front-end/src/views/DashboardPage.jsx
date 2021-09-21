import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Tasks from "../redux/components/Tasks.jsx";
import Notes from "../redux/components/Notes.jsx";
import Chart from "../redux/components/Chart.jsx";
import YearlyTotalCard from "../redux/components/YearlyTotalCard.jsx";
import MonthlyTotalCard from "../redux/components/MonthlyTotalCard.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import Controller from "../components/Controller/Controller.jsx";
import { selectAuth } from "../redux/app/store.js";
import { getRecordFields } from "../configs.jsx";
import { setCurrentPage } from "../redux/slices/common/settings.js";

const GenericCard = (props) => {
  return (
    <Card {...props} className="my-3 mx-1">
      <Card.Header>
        <Card.Title>{props.title}</Card.Title>
        <span className="text-muted">{props.subtitle}</span>
      </Card.Header>
      <Card.Body style={{ overflowY: "auto" }}>{props.children}</Card.Body>
      <Card.Footer>
        <div className="d-flex justify-content-center align-items-center">
          <FontAwesomeIcon className="fa-fw mx-2" icon={faAngleRight} />
          <span>
            <Link to={props.href}>Go to {props.title}</Link>
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default function DashboardPage({ ...props }) {
  const auth = useSelector(selectAuth);
  const recordFields = getRecordFields();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentPage("Home"));
  }, []);

  return (
    <MainLayout>
      <Controller title="Dashboard" bg="light" expand="lg"></Controller>
      <Container fluid className="px-5">
        <Row>
          <Col sm={12} md={6}>
            <MonthlyTotalCard />
          </Col>
          <Col sm={12} md={6}>
            <YearlyTotalCard />
          </Col>
          {
            // <Col sm={12} md={6}>
            //   <SummaryCard
            //     data={{
            //       data: 1000,
            //       icon: faYenSign,
            //       label: "Saving (ゆうちょ銀行)",
            //       lastUpdated: new Date().toLocaleDateString(),
            //     }}
            //     icon={{ icon: faPiggyBank, color: "lightgreen" }}
            //   />
            // </Col>
            // <Col sm={12} md={6}>
            //   <SummaryCard
            //     data={{
            //       data: 1000,
            //       icon: faDollarSign,
            //       label: "Saving (BoC)",
            //       lastUpdated: new Date().toLocaleDateString(),
            //     }}
            //     icon={{ icon: faPiggyBank, color: "lightblue" }}
            //   />
            // </Col>
          }
        </Row>
        <Row>
          <Col xs={12}>
            <GenericCard
              title="Expense"
              subtitle="Expenses for the month"
              href="/expense"
              style={{ minHeight: "600px" }}
            >
              <Chart categories={recordFields[1].choices} />
            </GenericCard>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <GenericCard
              title="Tasks"
              subtitle="Starred Tasks"
              href="/tasks"
              style={{ maxHeight: "1000px" }}
            >
              <div className="px-lg-3 py-3">
                <Tasks />
              </div>
            </GenericCard>
          </Col>
          <Col lg={6}>
            <GenericCard
              title="Notes"
              subtitle="Starred Notes"
              href="/notes"
              style={{ maxHeight: "1000px" }}
            >
              <div className="py-lg-3">
                <Notes />
              </div>
            </GenericCard>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}
