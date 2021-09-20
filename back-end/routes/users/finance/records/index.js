"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Records = require("../../../../models/users/finance/records.js");

const dailyRouter = require("./daily.js");
const totalRouter = require("./total.js");

router.use("/daily", dailyRouter);
router.use("/total", totalRouter);

// route to all finance.records
router
  .route("/")
  .get((req, res) => {
    const start = Math.round(Number(req.query.start)) || 0;
    const end = Math.round(Number(req.query.end)) || 100 * 365 * 24 * 60 * 60 * 1000;
    Records.find({ userId: req.params.uid, date: { $gte: start, $lte: end } })
      .sort({ date: "desc" })
      .then((records) => {
        res.status(200).json({
          success: true,
          message: `returned ${records.length} results.`,
          payload: records,
        });
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: "GET not success.", payload: null });
        console.log(err);
      });
  })
  .post((req, res) => {
    Records.create(req.body).then(
      (record) => {
        res.status(200).json({
          success: true,
          message: "added one record.",
          payload: record,
        });
      },
      (err) => {
        res.status(400).json({ success: false, message: `POST not success`, payload: null });
        console.log(err);
      }
    );
  })
  .put((req, res) => {
    res.status(501).json({ error: "PUT is not implemented." });
  })
  .delete((req, res) => {
    res.status(501).json({ error: "DELETE is not implemented." });
  });

// route to users' individual finance.accounts
router
  .route("/:id")
  .get((req, res) => {
    Records.findOne({ userId: req.params.uid, _id: req.params.id })
      .then((record) => {
        res.status(200).json({ success: true, message: "GET success.", payload: record });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "GET not success.", payload: null });
        console.log(err.message);
      });
  })
  .put((req, res) => {
    Records.findOneAndUpdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
      findOneAndModify: false,
      new: true,
    })
      .then((record) => {
        if (!record) {
          res.status(400).json({
            success: false,
            message: `PUT not success, cannot find record:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `PUT success, updated one record: ${record}.`,
          payload: record,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: `PUT not success`, payload: null });
        console.log(err.message);
      });
  })
  .delete((req, res) => {
    Records.findOneAndDelete(
      { userId: req.params.uid, _id: req.params.id },
      {
        findOneAndModify: false,
      }
    )
      .then((record) => {
        if (!record) {
          res.status(400).json({
            success: false,
            message: `DELETE not success, cannot find record:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `DELETE success, deleted one record: ${record}.`,
          payload: record,
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: "DELETE not success.",
          payload: null,
        });
        console.log(err.message);
      });
  })
  .post((req, res) => {
    res.status(501).json({ error: "POST is not implemented." });
  });

module.exports = router;
