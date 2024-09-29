const passport = require("passport");
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const User = require("../models/user.js");

function setJwtStrategy() {
  const secret = process.env.SECRET;
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  passport.use(
    new JWTStrategy(params, async function (payload, done) {
      try {
        const user = await User.findById(payload._id).lean();
        if (!user) {
          return done(null, false, { message: "User is not found." });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
}

module.exports = setJwtStrategy;
