"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const Notes = require("../../../models/users/notes");
const multer = require("multer");
const upload = multer();
const minio = require("minio");
const minioClient = new minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USESSL === "true",
  accessKey: process.env.MINIO_ACCESSKEY,
  secretKey: process.env.MINIO_SECRETKEY,
});
const minioBucket = process.env.MINIO_BUCKET;

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
  .route("/images")
  .post(upload.single("image"), (req, res) => {
    if (req.file) {
      if (req.file.size > 5 * 1000000) {
        return res.status(400).json({
          success: false,
          message: `Image to be uploaded cannot be larger than 5MB.`,
          payload: null,
        });
      }
      // maybe update this to support more types
      if (
        !(
          req.file.mimetype === "image/png" ||
          req.file.mimetype === "image/gif" ||
          req.file.mimetype === "image/jpeg"
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Only .png, .gif and .jpeg are supported.`,
          payload: null,
        });
      }
      minioClient
        .putObject(minioBucket, req.body.imageContentId, req.file.buffer, req.file.size)
        .then(() => {
          res.status(200).json({
            success: true,
            message: `Uploaded one image.`,
            payload: { id: req.body.imageContentId },
          });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ success: false, message: `Internal Server Error.`, payload: null });
          console.log(err);
        });
    }
  })
  .get((req, res) => {
    res.status(501).json({ error: "GET is not implemented." });
  })
  .put((req, res) => {
    res.status(501).json({ error: "PUT is not implemented." });
  })
  .delete((req, res) => {
    res.status(501).json({ error: "DELETE is not implemented." });
  });

router
  .route("/images/:id")
  .get((req, res) => {
    minioClient
      .presignedGetObject(minioBucket, req.params.id, 7 * 24 * 3600)
      .then((presignedURL) => {
        res.status(200).json({
          success: true,
          message: `Got temporary access URL for image with id: ${req.params.id}.`,
          payload: { id: req.params.id, presignedURL: presignedURL },
        });
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: `Internal Server Error.`, payload: null });
        console.log(err);
      });
  })
  .put(upload.single("image"), (req, res) => {
    if (req.file) {
      if (req.file.size > 5 * 1000000) {
        return res.status(400).json({
          success: false,
          message: `Image to be uploaded cannot be larger than 5MB.`,
          payload: null,
        });
      }
      // maybe update this to support more types
      if (
        !(
          req.file.mimetype === "image/png" ||
          req.file.mimetype === "image/gif" ||
          req.file.mimetype === "image/jpeg"
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Only .png, .gif and .jpeg are supported.`,
          payload: null,
        });
      }
      minioClient
        .removeObject(minioBucket, req.params.id)
        .then(() => {
          minioClient
            .putObject(minioBucket, req.params.id, req.file.buffer, req.file.size)
            .then(() => {
              res.status(200).json({ success: true, message: `Updated one image.`, payload: null });
            })
            .catch((err) => {
              res
                .status(500)
                .json({ success: false, message: `Internal Server Error.`, payload: null });
              console.log(err);
            });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ success: false, message: `Internal Server Error.`, payload: null });
          console.log(err);
        });
    }
  })
  .delete((req, res) => {
    minioClient
      .removeObject(minioBucket, req.params.id)
      .then(() => {
        res
          .status(200)
          .json({ success: true, message: `Removed one image.`, payload: { id: req.params.id } });
      })
      .catch((err) => {
        res.status(500).json({ success: false, message: `Internal Server Error.`, payload: null });
        console.log(err);
      });
  })
  .post((req, res) => {
    res.status(501).json({ error: "POST is not implemented." });
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
    Notes.findOneAndDelete(
      { userId: req.params.uid, _id: req.params.id },
      {
        findOneAndModify: false,
      }
    )
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
