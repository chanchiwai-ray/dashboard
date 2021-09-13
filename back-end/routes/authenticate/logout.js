"use strict";

const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  if (!req.session.passport || !req.session.passport.user)
    return res.status(400).json({
      success: false,
      message: "Error: your are not logged in or you already logged out.",
      payload: null,
    });

  req.logout();
  res.status(200).json({ success: true, message: "Logged out.", payload: null });
});

module.exports = router;
