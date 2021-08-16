"use strict";

const express = require("express");
const router = express.Router();
const cors = require("./cors.js");
const Users = require("../models/user.js");
const authenticate = require("../authenticate.js");

router.use(express.json());
router.use(cors.cors);
router.use(authenticate.isLoggedIn);

// default route to /users
router
  .route("/")
  .post((req, res) => {
    Users.create(req.body)
      .then((user) => {
        res.status(200).json({ success: true, message: "added one user.", payload: user });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "POST not success", payload: null });
        console.log(err.message);
      });
  })
  .get((req, res) => {
    Users.find({})
      .then((users) => {
        res.status(200).json({
          success: true,
          message: `returning ${users.length} users.`,
          payload: users,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "POST not success", payload: null });
        console.log(err.message);
      });
  })
  .put((req, res) => {
    res.status(501).json({ error: "PUT is not implemented." });
  })
  .delete((req, res) => {
    res.status(501).json({ error: "DELETE is not implemented." });
  });

// route to users:id's profile
router
  .route("/:uid/profile")
  .get((req, res) => {
    Users.findOne({ _id: req.params.uid })
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
    Users.findOneAndUpdate({ _id: req.params.uid }, req.body, {
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
