"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: false,
    default: "",
  },
  accountBalance: {
    type: Number,
    required: false,
    default: 0,
  },
});

schema.pre("save", function (next) {
  this.label = `${this.get("bankName")} (${this.get("accountNumber")})`;
  next();
});

module.exports = new mongoose.model("bankAccount", schema);
