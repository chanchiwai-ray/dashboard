"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Contacts = require("../../../models/users/contacts");

router
  .route("/")
  .get((req, res) => {
    Contacts.find({ userId: req.params.uid }).then(
      (contacts) => {
        res.status(200).json({
          success: true,
          message: `returned ${contacts.length} results.`,
          payload: contacts,
        });
      },
      (err) => {
        res.status(500).json({ success: false, message: "GET not success.", payload: null });
        console.log(err);
      }
    );
  })
  .post((req, res) => {
    Contacts.create(req.body).then(
      (contact) => {
        res.status(200).json({
          success: true,
          message: "added one contact.",
          payload: contact,
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
    Contacts.findOne({ userId: req.params.uid, _id: req.params.id })
      .then((contact) => {
        res.status(200).json({ success: true, message: "GET success.", payload: contact });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "GET not success.", payload: null });
        console.log(err.message);
      });
  })
  .put((req, res) => {
    Contacts.findOneAndUpdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
      findOneAndModify: false,
      new: true,
    })
      .then((contact) => {
        if (!contact) {
          res.status(400).json({
            success: false,
            message: `PUT not success, cannot find contact:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `PUT success, updated one contact: ${contact}.`,
          payload: contact,
        });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: `PUT not success`, payload: null });
        console.log(err.message);
      });
  })
  .delete((req, res) => {
    Contacts.findOneAndDelete(
      { userId: req.params.uid, _id: req.params.id },
      {
        findOneAndModify: false,
      }
    )
      .then((contact) => {
        if (!contact) {
          res.status(400).json({
            success: false,
            message: `DELETE not success, cannot find contact: ${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `DELETE success, deleted one contact: ${contact}.`,
          payload: contact,
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
