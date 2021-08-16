"use strict";

// Load required modules
const cookieParser = require("cookie-parser");
const express = require("express");
const expressSession = require("express-session");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

// Try connecting to mongodb
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    (db) => {
      console.log(`Connected to mongodb://${db.connection.host}:${db.connection.port}`);
    },
    (err) => {
      console.log(err);
    }
  );

const userRouter = require("./routes/users.js");
const financeRouter = require("./routes/finances.js");
const authenticateRouter = require("./routes/authenticate.js");

const app = express();

app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    cookie: {
      sameSite: "lax",
      maxAge: 7 * 24 * 3600 * 1000,
    },
    saveUninitialized: false,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/apis/users", userRouter);
app.use("/apis/finances", financeRouter);
app.use("/apis/authenticate", authenticateRouter);

module.exports = app;
