"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const authenticate = require("../../../authenticate.js");

const recordsRouter = require("./records");
const accountsRouter = require("./accounts");
const categoriesRouter = require("./categories");

// default route to /finances
router.all("/", (req, res) => {
  res.status(501).json({ error: "GET is not implemented." });
});

router.use(authenticate.isSameUser);
router.use("/records", recordsRouter);
router.use("/accounts", accountsRouter);
router.use("/categories", categoriesRouter);

module.exports = router;
