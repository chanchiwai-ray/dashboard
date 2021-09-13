"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Records = require("../../../../models/users/finance/records.js");

// route to get the finance.records grouped by date and from start to end
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
        $addFields: {
          createdAt: {
            $toDate: {
              $toLong: "$date",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
            day: {
              $dayOfMonth: "$createdAt",
            },
            category: "$category",
          },
          categoryTotal: {
            $sum: "$amount",
          },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
          dailyTotal: {
            $sum: "$categoryTotal",
          },
          categorySubTotal: {
            $push: {
              category: "$_id.category",
              total: "$categoryTotal",
            },
          },
        },
      },
    ])
      .then((sums) => {
        res.status(200).json({
          success: true,
          message: `returned ${sums.length} results.`,
          payload: sums,
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
