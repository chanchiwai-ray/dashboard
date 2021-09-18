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
  title: {
    type: String,
    default: "",
  },
  labels: [
    {
      id: { type: String, default: new mongoose.Types.ObjectId() },
      label: { type: String, default: "Default" },
    },
  ],
  description: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: String,
    default: "",
  },
  modifiedDate: {
    type: String,
    default: Date.now(),
  },
  priority: {
    type: Number,
    default: 0,
  },
});

// Build and export the model
module.exports = new mongoose.model("users.tasks", schema);
