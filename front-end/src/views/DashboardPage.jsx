import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Chart from "../components/Chart/Chart.jsx";
import SummaryCard from "../components/SummaryCard/SummaryCard.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

import { Container, Row, Col, Card, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleRight,
  faYenSign,
  faPiggyBank,
  faDollarSign,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";

import Controller from "../components/Controller/Controller.jsx";
import Context from "../contexts.jsx";
import { useAuthFetch, useDates } from "../utils.jsx";
import { recordFields } from "../configs.jsx";

const date = new Date();
const startMonth = new Date(date.getFullYear(), 0, 1);
const endMonth = new Date(date.getFullYear(), 11, 1);
const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

const GenericCard = (props) => {
  return (
    <Card {...props} className="my-3 mx-1">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <span className="text-muted">{props.subtitle}</span>
        {props.children}
      </Card.Body>
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
  const [dates, dateAction] = useDates(new Date());
  const [montlyExpense, montlyExpenseAction] = useAuthFetch("finances", "records/total", {
    start: Date.parse(dates[0] || startDate),
    end: Date.parse(dates[dates.length - 1]) || endDate,
  });
  const [yearlExpense, yearlyExpenseAction] = useAuthFetch("finances", "records/total", {
    start: Date.parse(startMonth),
    end: Date.parse(endMonth),
  });
  const [dailyRecordState, dailyRecordAction] = useAuthFetch("finances", "records/daily", {
    start: Date.parse(dates[0] || startDate),
    end: Date.parse(dates[dates.length - 1] || endDate),
  });
  const [categoryState, categoryAction] = useAuthFetch("finances", "categories");

  const context = useContext(Context);
  useEffect(() => {
    context.updatePage("Home");
  });

  useEffect(() => {
    dailyRecordAction.reload({
      start: Date.parse(dates[0] || startDate),
      end: Date.parse(dates[dates.length - 1] || endDate),
    });
    montlyExpenseAction.reload({
      start: Date.parse(dates[0] || startDate),
      end: Date.parse(dates[dates.length - 1] || endDate),
    });
    if (dates[0]) {
      startMonth.setFullYear(dates[0].getFullYear());
      endMonth.setFullYear(dates[0].getFullYear());
    }
    yearlyExpenseAction.reload({
      start: Date.parse(startMonth),
      end: Date.parse(endMonth),
    });
  }, [dates]);

  useEffect(() => {
    let categoryField = recordFields.filter((field) => field.id === 2)[0];
    if (categoryState.success) {
      categoryField.choices = categoryState.payload;
    }
  }, [categoryState]);

  return (
    <MainLayout>
      <Controller title="Dashboard" bg="light" expand="lg"></Controller>
      <Container className="container">
        <Row>
          <Col sm={12} md={6}>
            <SummaryCard
              data={{
                data:
                  montlyExpense.success && montlyExpense.payload.length === 1
                    ? montlyExpense.payload[0].total
                    : 0,
                icon: faYenSign,
                label: "Monthly Expense",
                lastUpdated: new Date().toLocaleDateString(),
              }}
              icon={{ icon: faMoneyBillAlt, color: "gray" }}
            />
          </Col>
          <Col sm={12} md={6}>
            <SummaryCard
              data={{
                data:
                  yearlExpense.success && yearlExpense.payload.length === 1
                    ? yearlExpense.payload[0].total
                    : 0,
                icon: faYenSign,
                label: "Yearly Expense",
                lastUpdated: new Date().toLocaleDateString(),
              }}
              icon={{ icon: faHandHoldingUsd, color: "orange" }}
            />
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
              {
                <Chart
                  dates={dates}
                  records={dailyRecordState.payload}
                  categories={categoryState.payload}
                  dateAction={dateAction}
                />
              }
            </GenericCard>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}
