"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Accounts = require("../../../../models/users/finance/accounts.js");

// route to users' all finance.accounts
router
  .route("/")
  .get((req, res) => {
    Accounts.find({ userId: req.params.uid }).then(
      (accounts) => {
        res.status(200).json({
          success: true,
          message: `returned ${accounts.length} results.`,
          payload: accounts,
        });
      },
      (err) => {
        res.status(500).json({ success: false, message: "GET not success.", payload: null });
        console.log(err);
      }
    );
  })
  .post((req, res) => {
    Accounts.create(req.body).then(
      (account) => {
        res.status(200).json({
          success: true,
          message: "added one account.",
          payload: account,
        });
      },
      (err) => {
        res.status(500).json({ success: false, message: `POST not success`, payload: null });
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

// route to users:id's individual bank accounts
router
  .route("/:id")
  .get((req, res) => {
    Accounts.findOne({ userId: req.params.uid, _id: req.params.id })
      .then((account) => {
        res.status(200).json({ success: true, message: "GET success.", payload: account });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: `GET not success, cannot find account:${req.params.id}.`,
          payload: null,
        });
        console.log(err.message);
      });
  })
  .put((req, res) => {
    Accounts.fineOneAndUpdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
      findOneAndModify: false,
      new: true,
    })
      .then((account) => {
        if (!account) {
          res.status(400).json({
            success: false,
            message: `PUT not success, cannot find account:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({ success: true, message: "PUT success.", payload: account });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: `PUT not success`, payload: null });
        console.log(err.message);
      });
  })
  .delete((req, res) => {
    Accounts.findOneAndDelete({ userId: req.params.uid, _id: req.params.id })
      .then((account) => {
        if (!account) {
          res.status(400).json({
            success: false,
            message: `DELETE not success, cannot find account:${req.params.id}.`,
            payload: null,
          });
        }
        res.status(200).json({
          success: true,
          message: `DELETE success, deleted one account: ${account}.`,
          payload: account,
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
