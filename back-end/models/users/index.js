"use strict";

// Load mongoose
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Define the schema
const schema = new mongoose.Schema({});

schema.plugin(passportLocalMongoose, { usernameField: "account" });

// Build and export the model
module.exports = new mongoose.model("users", schema);
