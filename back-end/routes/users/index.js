"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const cors = require("../cors.js");
const Users = require("../../models/users/index.js");
const authenticate = require("../../authenticate.js");

const notes = require("./notes");
const profile = require("./profile");
const finance = require("./finance");
const contacts = require("./contacts");

router.use(express.json());
router.use(cors.cors);
router.use(authenticate.isLoggedIn);

// default route to /users
router
  .route("/")
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
  .put((req, res) => {
    res.status(501).json({ error: "PUT is not implemented." });
  })
  .delete((req, res) => {
    res.status(501).json({ error: "DELETE is not implemented." });
  });

router.use("/:uid/notes", notes);
router.use("/:uid/profile", profile);
router.use("/:uid/finance", finance);
router.use("/:uid/contacts", contacts);

module.exports = router;
