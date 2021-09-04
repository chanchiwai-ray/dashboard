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
import { monthlyExpenseCardSlice, yearlyExpenseCardSlice, chartSlice } from "../store.js";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../authenticate.jsx";

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
  const auth = useAuth();
  const monthlySummaryCardState = useSelector(monthlyExpenseCardSlice.selector);
  const yearlySummaryCardState = useSelector(yearlyExpenseCardSlice.selector);
  const chartState = useSelector(chartSlice.selector);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.verifySession();
  }, []);

  useEffect(() => {
    if (dates.length > 0 && auth.userId) {
      dispatch(
        chartSlice.extraActions.getDailyRecords({
          userId: auth.userId,
          query: {
            start: Date.parse(dates[0] || startDate),
            end: Date.parse(dates[dates.length - 1]) || endDate,
          },
        })
      );
      dispatch(
        chartSlice.extraActions.getCategories({
          userId: auth.userId,
        })
      );
      dispatch(
        monthlyExpenseCardSlice.extraActions.getTotalExpense({
          userId: auth.userId,
          query: {
            start: Date.parse(dates[0] || startDate),
            end: Date.parse(dates[dates.length - 1]) || endDate,
          },
        })
      );
      dispatch(
        yearlyExpenseCardSlice.extraActions.getTotalExpense({
          userId: auth.userId,
          query: {
            start: Date.parse(startMonth),
            end: Date.parse(endMonth),
          },
        })
      );
    }
  }, [dates, auth]);

  const context = useContext(Context);
  useEffect(() => {
    context.updatePage("Home");
  });

  return (
    <MainLayout>
      <Controller title="Dashboard" bg="light" expand="lg"></Controller>
      <Container className="container">
        <Row>
          <Col sm={12} md={6}>
            <SummaryCard
              data={{
                value: monthlySummaryCardState.value,
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
                value: yearlySummaryCardState.value,
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
              {chartState.success ? (
                <Chart
                  dates={dates}
                  records={chartState.value.dailyRecords}
                  categories={chartState.value.categories}
                  dateAction={dateAction}
                />
              ) : (
                <h1>{chartState.message}</h1>
              )}
            </GenericCard>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}
