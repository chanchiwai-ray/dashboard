const passport = require("passport");
const Users = require("./models/users");

passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.isLoggedIn = (req, res, next) => {
  if (req.session.passport && req.session.passport.user) {
    return next();
  } else {
    res.status(403).json({
      success: false,
      message: "Permission denied: you are not logged in.",
      payload: null,
    });
  }
};

exports.isSameUser = (req, res, next) => {
  Users.findOne({ _id: req.params.uid })
    .then((user) => {
      if (!user) {
        return res.status(403).json({
          success: false,
          message: "Error: cannot find such user.",
          payload: null,
        });
      } else if (user.account !== req.session.passport.user) {
        return res.status(403).json({
          success: false,
          message: "Permission denied: requesting resources that does not belong to you.",
          payload: null,
        });
      }
      return next();
    })
    .catch((err) => console.log(err));
};
//
// JWT Passport
//

// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const jsonwebtoken = require('jsonwebtoken');
// const opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = process.env.JWT_SECRET;

// exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
//   console.log(jwt_payload);
//   Users.findOne({_id: jwt_payload._id}, (err, user) => {
//     if (err) {
//       return done(err, false);
//     } else if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   });
// }));

// exports.getJsonWebToken = (user) => {
//   return jsonwebtoken.sign(user, process.env.JWT_SECRET, {expiresIn: "7d"} )
// };
