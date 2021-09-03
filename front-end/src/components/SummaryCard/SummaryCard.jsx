import React, { useEffect } from "react";

import { Row, Col } from "react-bootstrap";
import { Card } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./SummaryCard.module.css";

export default function SummaryCard({ data, icon, ...props }) {
  return (
    <Card className="my-3 mx-1">
      <Card.Body>
        <Row>
          <Col xs={4} className="d-flex align-items-center justify-content-center ">
            {icon ? (
              <FontAwesomeIcon size="4x" icon={icon.icon} color={icon.color} />
            ) : (
              <span></span>
            )}
          </Col>
          <Col xs={8} className="ml-auto">
            <span className={`text-muted ${styles["body-label"]}`}>{data.label}</span>
            <span className={`${styles["body-text"]}`}>
              <FontAwesomeIcon icon={data.icon} color={data.color} />
              {data.value}
            </span>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <span className={`text-muted fs-6 ${styles["footer-text"]}`}>
          Last Updated: {data.lastUpdated}
        </span>
      </Card.Footer>
    </Card>
  );
}
