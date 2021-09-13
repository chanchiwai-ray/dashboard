"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const Users = require("../../models/users");
const Profile = require("../../models/users/profile");

router.route("/").post((req, res, next) => {
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
      Profile.create({ userId: req.user._id }).then((profile) => {
        if (profile) {
          res.status(200).json({
            success: true,
            message: "Sign up successfully. Now returning the user ID...",
            payload: req.user._id,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Sign up fails.",
            payload: null,
          });
        }
      });
    });
  });
});

module.exports = router;
