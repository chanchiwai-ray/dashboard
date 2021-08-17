"use strict";

const express = require("express");
const router = express.Router();
const cors = require("./cors.js");
const authenticate = require("../authenticate.js");
const Records = require("../models/financeRecord.js");
const Accounts = require("../models/bankAccount.js");
const Categories = require("../models/recordCategory.js");

router.use(express.json());
router.use(cors.cors);
router.use(authenticate.isLoggedIn);

// default route to /finances
router.all("/", (req, res) => {
  res.status(501).json({ error: "GET is not implemented." });
});

// route to users:id's all finance records
router
  .route("/:uid/records")
  .get(authenticate.isSameUser, (req, res) => {
    Records.find({ userId: req.params.uid })
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
  .post(authenticate.isSameUser, (req, res) => {
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

// route to users:id's individual finance record
router
  .route("/:uid/records/:id")
  .get(authenticate.isSameUser, (req, res) => {
    Records.find({ userId: req.params.uid, _id: req.params.id })
      .then((record) => {
        res.status(200).json({ success: true, message: "GET success.", payload: record });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "GET not success.", payload: null });
        console.log(err.message);
      });
  })
  .put(authenticate.isSameUser, (req, res) => {
    Records.findOneAndupdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
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
  .delete(authenticate.isSameUser, (req, res) => {
    Records.findOneAndDelete({ userId: req.params.uid, _id: req.params.id })
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

// route to users:id's all bank accounts
router
  .route("/:uid/accounts")
  .get(authenticate.isSameUser, (req, res) => {
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
  .post(authenticate.isSameUser, (req, res) => {
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
  .route("/:uids/accounts/:id")
  .get(authenticate.isSameUser, (req, res) => {
    Accounts.find({ userId: req.params.uid, _id: req.params.id })
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
  .put(authenticate.isSameUser, (req, res) => {
    Accounts.findOneAndupdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
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
  .delete(authenticate.isSameUser, (req, res) => {
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

// route to users:id all record categories
router
  .route("/:uid/categories")
  .get(authenticate.isSameUser, (req, res) => {
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
  .post(authenticate.isSameUser, (req, res) => {
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
  .route("/:uid/categories/:id")
  .get(authenticate.isSameUser, (req, res) => {
    Categories.find({ userId: req.params.uid, _id: req.params.id })
      .then((category) => {
        res.status(200).json({ success: true, message: "GET success.", payload: category });
      })
      .catch((err) => {
        res.status(400).json({ success: false, message: "GET not success.", payload: null });
        console.log(err.message);
      });
  })
  .put(authenticate.isSameUser, (req, res) => {
    Categories.findOneAndupdate({ userId: req.params.uid, _id: req.params.id }, req.body, {
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
  .delete(authenticate.isSameUser, (req, res) => {
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
