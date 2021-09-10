import React, { useEffect } from "react";

import { Container, Row, Col } from "react-bootstrap";

import CardUser from "../components/CardUser/CardUser.jsx";
import CardContact from "../components/CardContact/CardContact.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../redux/slices/common/settings.js";
import { selectAuth, selectProfile } from "../redux/app/store.js";
import { getProfile, putProfile } from "../redux/slices/user/profile.js";

export default function ProfilePage(props) {
  const auth = useSelector(selectAuth);
  const profile = useSelector(selectProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile({ userId: auth.value.userId }));
    dispatch(setCurrentPage(undefined));
  }, []);

  return (
    <MainLayout>
      <Container>
        <Row>
          <Col lg={12} className="my-3">
            <CardUser
              profile={profile.value}
              updateProfile={(data) =>
                dispatch(putProfile({ userId: auth.value.userId, data: data }))
              }
            />
          </Col>
          <Col lg={12} className="my-3">
            <CardContact
              profile={profile.value}
              updateProfile={(data) =>
                dispatch(putProfile({ userId: auth.value.userId, data: data }))
              }
            />
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
}
