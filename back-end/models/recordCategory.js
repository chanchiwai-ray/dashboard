"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("category", schema);
