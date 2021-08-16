"use strict";

const cors = require("cors");

exports.cors = cors({
  credentials: true,
  origin: process.env.FRONTEND,
});
