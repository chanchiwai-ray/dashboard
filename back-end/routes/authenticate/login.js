"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");

router.route("/").post((req, res, next) => {
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

module.exports = router;
