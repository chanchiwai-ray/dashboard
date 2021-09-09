import React, { useEffect, useState } from "react";

import { Row, Col } from "react-bootstrap";
import { ButtonGroup, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCaretSquareLeft,
  faCaretSquareRight,
  faCircle,
} from "@fortawesome/free-regular-svg-icons";
import { faChartPie, faChartLine } from "@fortawesome/free-solid-svg-icons";

import styles from "./Chart.module.css";
import BarChart from "./BarChart.jsx";
import LineChart from "./LineChart.jsx";
import DoughnutChart from "./DoughnutChart.jsx";

const ChartContainer = (props) => {
  return (
    <Row className={`${styles["container"]}`}>
      <Col xs={12} lg={2} className="d-flex justify-content-center align-items-center">
        <ButtonGroup className="m-2">
          <Button
            variant="outline-info"
            active={props.currView === "bar"}
            onClick={() => props.onChangeView("bar")}
          >
            <FontAwesomeIcon icon={faChartBar} />
          </Button>
          <Button
            variant="outline-info"
            active={props.currView === "line"}
            onClick={() => props.onChangeView("line")}
          >
            <FontAwesomeIcon icon={faChartLine} />
          </Button>
          <Button
            variant="outline-info"
            active={props.currView === "doughnut"}
            onClick={() => props.onChangeView("doughnut")}
          >
            <FontAwesomeIcon icon={faChartPie} />
          </Button>
        </ButtonGroup>
      </Col>
      <Col xs={12} lg={8}>
        <h3 className="m-2 text-center">{props.title}</h3>
      </Col>
      <Col xs={12} lg={2} className="d-flex justify-content-center align-items-center">
        <ButtonGroup className="m-2">
          <Button variant="outline-info" onClick={() => props.handlePrevBtn()}>
            <FontAwesomeIcon icon={faCaretSquareLeft} />
          </Button>
          <Button variant="outline-info" onClick={() => props.handleCurrBtn()}>
            <FontAwesomeIcon icon={faCircle} />
          </Button>
          <Button variant="outline-info" onClick={() => props.handleNextBtn()}>
            <FontAwesomeIcon icon={faCaretSquareRight} />
          </Button>
        </ButtonGroup>
      </Col>
      <Col sm={12} className={`${styles["container"]}`}>
        {props.children}
      </Col>
    </Row>
  );
};

export default function Chart({ dates, records, categories, dateAction, ...props }) {
  const [view, setView] = useState("bar");
  console.log(1);
  const renderChart = (view) => {
    switch (view) {
      case "line":
        return (
          <LineChart
            datasource={{
              dates: dates,
              records: records,
            }}
            height={400}
            width={300}
          />
        );
      case "doughnut":
        return (
          <DoughnutChart
            datasource={{
              records: records,
              categories: categories,
            }}
            height={400}
            width={300}
          />
        );
      default:
        return (
          <BarChart
            datasource={{
              dates: dates,
              records: records,
              categories: categories,
            }}
            height={400}
            width={300}
          />
        );
    }
  };

  return (
    <ChartContainer
      title={
        dates.length === 0
          ? ""
          : dates[0].toLocaleString("default", {
              year: "numeric",
              month: "long",
            })
      }
      handlePrevBtn={() => {
        dateAction.prevMonth();
      }}
      handleCurrBtn={() => {
        dateAction.resetDates();
      }}
      handleNextBtn={() => {
        dateAction.nextMonth();
      }}
      onChangeView={(v) => setView(v)}
      currView={view}
    >
      {renderChart(view)}
    </ChartContainer>
  );
}
