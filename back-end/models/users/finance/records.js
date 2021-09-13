"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now(),
  },
  account: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    default: "Foods",
  },
  description: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = new mongoose.model("users.finance.records", schema);
