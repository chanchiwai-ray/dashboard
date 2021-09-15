"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Notes = require("../../../models/users/notes");

router
  .route("/")
  .get((req, res) => {
    Notes.find({ userId: req.params.uid }).then(
      (notes) => {
        res.status(200).json({
          success: true,
          message: `returned ${notes.length} results.`,
          payload: notes,
        });
      },
      (err) => {
        res.status(500).json({ success: false, message: "GET not success.", payload: null });
        console.log(err);
      }
    );
  })
  .post((req, res) => {
    Notes.create(req.body).then(
      (note) => {
        res.status(200).json({
          success: true,
          message: "added one note.",
          payload: note,
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
    Notes.findOne({ userId: req.params.uid, _id: req.params.id })
      .then((note) => {
        res.status(200).json({ success: true, message: "GET success.", payload: note });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "GET not success.", payload: null });
        console.log(err.message);
      });
  })
  .put((req, res) => {
    Notes.findOneAndUpdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
      findOneAndModify: false,
      new: true,
    })
      .then((note) => {
        if (!note) {
          res.status(400).json({
            success: false,
            message: `PUT not success, cannot find note:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `PUT success, updated one note: ${note}.`,
          payload: note,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: `PUT not success`, payload: null });
        console.log(err.message);
      });
  })
  .delete((req, res) => {
    Notes.findOneAndDelete({ userId: req.params.uid, _id: req.params.id })
      .then((note) => {
        if (!note) {
          res.status(400).json({
            success: false,
            message: `DELETE not success, cannot find note: ${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `DELETE success, deleted one note: ${note}.`,
          payload: note,
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
