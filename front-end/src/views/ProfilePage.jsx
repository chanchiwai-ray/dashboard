import React, { useState, useEffect, useContext } from "react";

import { Container, Row, Col } from "react-bootstrap";

import CardUser from "../components/CardUser/CardUser.jsx";
import CardContact from "../components/CardContact/CardContact.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import Context from "../contexts.jsx";
import { useAuthFetch } from "../utils.jsx";

export default function ProfilePage(props) {
  const [profile, profileAction] = useAuthFetch("users", "profile");

  const context = useContext(Context);
  console.log(profile);
  useEffect(() => {
    context.updatePage("Profile");
  });

  return (
    <MainLayout>
      <Container>
        <Row>
          <Col lg={12} className="my-3">
            <CardUser profile={profile.payload} />
          </Col>
          <Col lg={12} className="my-3">
            <CardContact profile={profile.payload} />
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}
