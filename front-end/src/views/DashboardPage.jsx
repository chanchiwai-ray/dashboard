import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Chart from "../components/Chart/Chart.jsx";
import SummaryCard from "../components/SummaryCard/SummaryCard.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillAlt } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight, faYenSign, faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";

import Controller from "../components/Controller/Controller.jsx";
import { selectRecords, selectCategories, selectAuth, selectDates } from "../redux/app/store.js";
import {
  getDailyRecords,
  getMonthlyExpense,
  getYearlyExpense,
} from "../redux/slices/finance/records.js";
import { getCategories } from "../redux/slices/finance/categories.js";
import { setCurrentPage } from "../redux/slices/common/settings.js";
import { nextMonth, prevMonth, resetMonth } from "../redux/slices/common/dates.js";

const date = new Date();
const startMonth = new Date(date.getFullYear(), 0, 1);
const endMonth = new Date(date.getFullYear(), 11, 1);

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
  const auth = useSelector(selectAuth);
  const dates = useSelector(selectDates);
  const records = useSelector(selectRecords);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetMonth());
    dispatch(setCurrentPage("Home"));
  }, []);

  useEffect(() => {
    if (auth.value.userId) {
      dispatch(
        getDailyRecords({
          userId: auth.value.userId,
          query: {
            start: dates.value[0],
            end: dates.value[dates.value.length - 1],
          },
        })
      );
      dispatch(
        getCategories({
          userId: auth.value.userId,
        })
      );
      dispatch(
        getMonthlyExpense({
          userId: auth.value.userId,
          query: {
            start: dates.value[0],
            end: dates.value[dates.value.length - 1],
          },
        })
      );
      dispatch(
        getYearlyExpense({
          userId: auth.value.userId,
          query: {
            start: Date.parse(startMonth),
            end: Date.parse(endMonth),
          },
        })
      );
    }
  }, [dates, auth]);

  return (
    <MainLayout>
      <Controller title="Dashboard" bg="light" expand="lg"></Controller>
      <Container className="container">
        <Row>
          <Col sm={12} md={6}>
            <SummaryCard
              data={{
                value: records.value.totals.monthlyTotal,
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
                value: records.value.totals.yearlyTotal,
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
              {records.success ? (
                <Chart
                  dates={dates.value.map((unixTime) => new Date(Number(unixTime)))}
                  records={records.value.dailyRecords}
                  categories={categories.value}
                  dateAction={{
                    prevMonth: () => dispatch(prevMonth()),
                    resetMonth: () => dispatch(resetMonth()),
                    nextMonth: () => dispatch(nextMonth()),
                  }}
                />
              ) : (
                <h1>{records.message}</h1>
              )}
            </GenericCard>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}
