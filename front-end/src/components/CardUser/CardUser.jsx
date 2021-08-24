import React, { useEffect, useState } from "react";

import { Col, Card, Image, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import imageSource from "../../assets/images/pexels-nick-kwan-2614818.jpg";
import avatar from "../../assets/images/avatar.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faGlobe, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

import styles from "./CardUser.module.css";

// Note: this component handle state itself
function CardUser({ profile, updateProfile, ...props }) {
  const [userProfile, setUserProfile] = useState({});
  const [isEditingNickname, editNickname] = useState(false);
  const [isEditingJobTitle, editJobTitle] = useState(false);

  const onChange = (event, target) => {
    const newProfile = { ...userProfile };
    newProfile[target] = event.target.value;
    setUserProfile(newProfile);
  };

  const trimSpaces = (userProfile) => {
    const newProfile = { ...userProfile };
    newProfile.nickname = newProfile.nickname ? newProfile.nickname.trim() : newProfile.nickname;
    newProfile.jobTitle = newProfile.jobTitle ? newProfile.jobTitle.trim() : newProfile.jobTitle;
    return newProfile;
  };

  const onClickUpdateJobTitle = (isEditing) => {
    if (isEditing) {
      editJobTitle(false);
      const profile = trimSpaces(userProfile);
      updateProfile(null, profile);
      setUserProfile(profile);
    } else {
      editJobTitle(true);
    }
  };

  const onClickUpdateNickname = (isEditing) => {
    if (isEditing) {
      editNickname(false);
      const profile = trimSpaces(userProfile);
      updateProfile(null, profile);
      setUserProfile(profile);
    } else {
      editNickname(true);
    }
  };

  useEffect(() => {
    setUserProfile({
      nickname: profile.nickname,
      jobTitle: profile.jobTitle,
      profilePicture: profile.profilePicture,
      coverPicture: profile.profilePicture,
      email: profile.email,
      github: profile.github,
      linkedin: profile.linkedin,
      website: profile.website,
    });
  }, [profile]);

  return (
    <Card className={`${styles["card-user"]}`}>
      <div className={`${styles["image-container"]}`}>
        <Image className={`${styles["image"]}`} src={imageSource} />
      </div>
      <Card.Body>
        <div className={`${styles["author"]}`}>
          <Image className={`${styles["avatar"]}`} src={avatar} rounded />
          <div>
            {isEditingNickname ? (
              <input
                name="nickname"
                className={`${styles["name-edit"]}`}
                onChange={(e) => onChange(e, "nickname")}
                value={`${userProfile.nickname}`}
              />
            ) : (
              <h5 className={`${styles["name-view"]}`}>{`${userProfile.nickname}`}</h5>
            )}
            <a
              className={`${styles["edit-name-btn"]}`}
              onClick={() => onClickUpdateNickname(isEditingNickname)}
            >
              <FontAwesomeIcon icon={faPencilAlt} color="blue" />
            </a>
          </div>
          {isEditingJobTitle ? (
            <input
              name="jobTitle"
              className={`${styles["title-edit"]}`}
              onChange={(e) => onChange(e, "jobTitle")}
              value={`${userProfile.jobTitle}`}
            />
          ) : (
            <p className={`${styles["title-view"]}`}>{`${userProfile.jobTitle}`}</p>
          )}
          <a
            className={`${styles["edit-title-btn"]}`}
            onClick={() => onClickUpdateJobTitle(isEditingJobTitle)}
          >
            <FontAwesomeIcon icon={faPencilAlt} color="blue" />
          </a>
        </div>
      </Card.Body>
      <hr />
      <Col className="text-center mb-3">
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Email</Tooltip>}>
          <Button tag="a" href={`mailto:${userProfile.email}`} className="m-2">
            <FontAwesomeIcon icon={faEnvelope} />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Github</Tooltip>}>
          <Button tag="a" target="_blank" href={userProfile.github} className="m-2">
            <FontAwesomeIcon icon={faGithub} />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>LinkedIn</Tooltip>}>
          <Button tag="a" target="_blank" href={userProfile.linkedin} className="m-2">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Personal Website</Tooltip>}>
          <Button tag="a" target="_blank" href={userProfile.website} className="m-2">
            <FontAwesomeIcon icon={faGlobe} />
          </Button>
        </OverlayTrigger>
      </Col>
    </Card>
  );
}

export default CardUser;
