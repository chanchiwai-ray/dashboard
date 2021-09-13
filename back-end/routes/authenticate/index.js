"use strict";

const express = require("express");
const router = express.Router();

const loginRouter = require("./login.js");
const logoutRouter = require("./logout.js");
const signupRouter = require("./signup.js");
const verifyRouter = require("./verify.js");

router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/signup", signupRouter);
router.use("/verify", verifyRouter);

module.exports = router;
