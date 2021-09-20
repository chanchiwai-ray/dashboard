"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Tasks = require("../../../models/users/tasks");

router
  .route("/")
  .get((req, res) => {
    Tasks.find({ userId: req.params.uid }).then(
      (tasks) => {
        res.status(200).json({
          success: true,
          message: `returned ${tasks.length} results.`,
          payload: tasks,
        });
      },
      (err) => {
        res.status(500).json({ success: false, message: "GET not success.", payload: null });
        console.log(err);
      }
    );
  })
  .post((req, res) => {
    Tasks.create(req.body).then(
      (task) => {
        res.status(200).json({
          success: true,
          message: "added one task.",
          payload: task,
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

router
  .route("/:id")
  .get((req, res) => {
    Tasks.findOne({ userId: req.params.uid, _id: req.params.id })
      .then((task) => {
        res.status(200).json({ success: true, message: "GET success.", payload: task });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "GET not success.", payload: null });
        console.log(err.message);
      });
  })
  .put((req, res) => {
    Tasks.findOneAndUpdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
      findOneAndModify: false,
      new: true,
    })
      .then((task) => {
        if (!task) {
          res.status(400).json({
            success: false,
            message: `PUT not success, cannot find task:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `PUT success, updated one task: ${task}.`,
          payload: task,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: `PUT not success`, payload: null });
        console.log(err.message);
      });
  })
  .delete((req, res) => {
    Tasks.findOneAndDelete(
      { userId: req.params.uid, _id: req.params.id },
      {
        findOneAndModify: false,
      }
    )
      .then((task) => {
        if (!task) {
          res.status(400).json({
            success: false,
            message: `DELETE not success, cannot find task: ${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `DELETE success, deleted one task: ${task}.`,
          payload: task,
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
