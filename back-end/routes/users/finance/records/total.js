"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Records = require("../../../../models/users/finance/records.js");

// route to get the total finance.records from start to end
router
  .route("/")
  .get((req, res) => {
    const start = Math.round(Number(req.query.start)) || 0;
    const end = Math.round(Number(req.query.end)) || 100 * 365 * 24 * 60 * 60 * 1000;
    Records.aggregate([
      {
        $match: {
          userId: {
            $eq: req.params.uid,
          },
          date: {
            $gte: `${start}`,
            $lte: `${end}`,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ])
      .then((sum) => {
        res.status(200).json({
          success: true,
          message: "returned total amount.",
          payload: sum[0] ? sum[0].total : 0,
        });
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: "GET not success.", payload: null });
        console.log(err);
      });
  })
  .post((req, res) => {
    res.status(501).json({ error: "POST is not implemented." });
  })
  .put((req, res) => {
    res.status(501).json({ error: "PUT is not implemented." });
  })
  .delete((req, res) => {
    res.status(501).json({ error: "DELETE is not implemented." });
  });

module.exports = router;
