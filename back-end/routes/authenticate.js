"use strict";

const express = require("express");
const router = express.Router();
const cors = require("./cors.js");
const passport = require("passport");
const Users = require("../models/user.js");

router.use(express.json());
router.use(cors.cors);

router.route("/signup").post((req, res, next) => {
  Users.register(new Users({ account: req.body.account }), req.body.password, (err) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: `Sign up fails: ${err.message}.`,
        payload: null,
      });
      return next(err);
    }

    passport.authenticate("local")(req, res, () => {
      res.status(200).json({
        success: true,
        message: "Sign up successfully. Now returning the user ID...",
        payload: req.user._id,
      });
    });
  });
});

router.route("/login").post((req, res, next) => {
  if (!req.body.account || !req.body.password) {
    res.status(400).json({
      success: false,
      message: "Log in fails: account or password is not provided.",
      payload: null,
    });
  } else {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);

      if (!user)
        return res.status(400).json({
          success: false,
          message: `Log in fails: account or password is incorrect.`,
          payload: null,
        });

      req.login(user, (err) => {
        if (err) return next(err);

        res.status(200).json({
          success: true,
          message: "Log in successfully. Now returning the user ID...",
          payload: req.user._id,
        });
      });
    })(req, res, next);
  }
});

router.route("/logout").get((req, res) => {
  if (!req.session.passport || !req.session.passport.user)
    return res.status(400).json({
      success: false,
      message: "Error: your are not logged in or you already logged out.",
      payload: null,
    });

  req.logout();
  res.status(200).json({ success: true, message: "Logged out.", payload: null });
});

// verify the session is valid or not
router.route("/verify").get((req, res) => {
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
