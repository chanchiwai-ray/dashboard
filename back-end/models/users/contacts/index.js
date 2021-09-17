"use strict";

// Load mongoose
const mongoose = require("mongoose");

// Define the schema
const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  star: {
    type: Boolean,
    default: false,
  },
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  mobile: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
});

// Build and export the model
module.exports = new mongoose.model("users.contacts", schema);
