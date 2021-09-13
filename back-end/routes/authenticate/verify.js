"use strict";

const express = require("express");
const router = express.Router();
const Users = require("../../models/users/index.js");

// verify the session is valid or not
router.route("/").get((req, res) => {
  if (!req.session.passport || !req.session.passport.user)
    return res.status(403).json({
      success: false,
      message: "Forbidden: you are not logged in or you already logged out.",
      payload: null,
    });
  Users.findOne({ account: req.session.passport.user })
    .then((user) => {
      if (!user)
        return res.status(400).json({ success: false, message: "Invalid cookies", payload: null });
      res.status(200).json({
        success: true,
        message: "You are already logged in.",
        payload: user._id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: true,
        message: "Internal server error.",
        payload: null,
      });
    });
});

module.exports = router;
