"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Profile = require("../../../models/users/profile");
const authenticate = require("../../../authenticate.js");

router.use(authenticate.isSameUser);

router
  .route("/")
  .get((req, res) => {
    Profile.findOne({ userId: req.params.uid })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            success: false,
            message: `GET not success, cannot find user:${req.params.uid}.`,
            payload: null,
          });
        }
        res.status(200).json({ success: true, message: "GET success.", payload: user });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: `GET not success, cannot find user:${req.params.uid}.`,
          payload: null,
        });
        console.log(err.message);
      });
  })
  .put((req, res) => {
    Profile.findOneAndUpdate({ userId: req.params.uid }, req.body, {
      useFindAndModify: false,
      new: true,
    })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            success: false,
            message: `PUT not success, cannot find user:${req.params.uid}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `PUT success, updated one user: ${user}.`,
          payload: user,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: `PUT not success`, payload: null });
        console.log(err.message);
      });
  })
  .delete((req, res) => {
    res.status(501).json({ error: "DELETE is not implemented." });
  })
  .post((req, res) => {
    res.status(501).json({ error: "POST is not implemented." });
  });

module.exports = router;
