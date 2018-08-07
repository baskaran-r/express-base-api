const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../utils/db');
const { asyncWrap } = require('../utils/common');

module.exports = {
  local: new LocalStrategy(asyncWrap(async (username, password, done) => {

    const user = await db.exec("select * from users where mobile = ?",[username]);

    if (user.length === 0 || user.length !== 1) {
      return done(null, {}, { message: 'Incorrect username or password.' });
    }

    return done(null, user[0]);
  })),

  serializeUser: (user, cb) => {
    cb(null, user);
  },

  deserializeUser: (req, cb, done) => {
    done(null, req.session.user);
  }
}
