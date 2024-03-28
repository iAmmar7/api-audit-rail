const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const Admin = require('../db/models/Admin');
const User = require('../db/models/User');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PASSPORT_SECRET;

module.exports = (passport) => {
  passport.use(
    new JWTStrategy(opts, async (jwt_payload, done) => {
      if (jwt_payload.role === 'admin') {
        const admin = await Admin.findById(jwt_payload.id);
        if (admin) {
          return done(null, admin);
        }
        return done(null, false);
      }

      if (
        jwt_payload.role === 'auditor' ||
        jwt_payload.role === 'rm' ||
        jwt_payload.role === 'am' ||
        jwt_payload.role === 'sm' ||
        jwt_payload.role === 'viewer'
      ) {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      }
    }),
  );
};
