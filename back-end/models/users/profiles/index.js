"use strict";

// Load mongoose
const mongoose = require("mongoose");

// Define the schema
const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    default: "Your Name or Nick Name",
    required: false,
  },
  jobTitle: {
    type: String,
    default: "Job Title",
    required: false,
  },
  profilePicture: {
    type: Buffer,
    required: false,
  },
  coverPicture: {
    type: String,
    required: false,
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
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  zipcode: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
});

// Build and export the model
module.exports = new mongoose.model("users.profiles", schema);
