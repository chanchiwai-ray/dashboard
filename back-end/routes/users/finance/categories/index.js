"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Categories = require("../../../../models/users/finance/categories.js");

// route to users' finance.categories
router
  .route("/")
  .get((req, res) => {
    Categories.find({ userId: req.params.uid }).then(
      (categories) => {
        res.status(200).json({
          success: true,
          message: `returned ${categories.length} results.`,
          payload: categories,
        });
      },
      (err) => {
        res.status(500).json({ success: false, message: "GET not success.", payload: null });
        console.log(err);
      }
    );
  })
  .post((req, res) => {
    Categories.create(req.body).then(
      (category) => {
        res.status(200).json({
          success: true,
          message: "added one record.",
          payload: category,
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

// route to users:id individual record categories
router
  .route("/:id")
  .get((req, res) => {
    Categories.findOne({ userId: req.params.uid, _id: req.params.id })
      .then((category) => {
        res.status(200).json({ success: true, message: "GET success.", payload: category });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "GET not success.", payload: null });
        console.log(err.message);
      });
  })
  .put((req, res) => {
    Categories.fineOneAndUpdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
      findOneAndModify: false,
      new: true,
    })
      .then((category) => {
        if (!category) {
          res.status(400).json({
            success: false,
            message: `PUT not success, cannot find record:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `PUT success, updated one record: ${category}.`,
          payload: category,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: `PUT not success`, payload: null });
        console.log(err.message);
      });
  })
  .delete((req, res) => {
    Categories.findOneAndDelete({ userId: req.params.uid, _id: req.params.id })
      .then((category) => {
        if (!category) {
          res.status(400).json({
            success: false,
            message: `DELETE not success, cannot find record:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `DELETE success, deleted one record: ${category}.`,
          payload: category,
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
