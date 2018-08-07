const passport = require('passport');
const { isEmpty, map, includes}      = require('lodash');
const db = require('../utils/db');
const { asyncWrap, handleError } = require('../utils/common');

module.exports = {
  signin (req, res, next) {
    passport.authenticate('local', function(err, user, error) {
      if (err) { return next(err); }
      if (isEmpty(user)) {
        handleError (res, {error}, 401);
        return;
      }

      req.login(user, function(loginError) {
          if (loginError) return next(loginError);

          let capabilities = db.exec("select c.`name` from role_capabilities rc left join capabilities c ON rc.`capability_id` = c.`id` where rc.`role_id` = ? ",[user.role]);
          capabilities.then(cap => {
            req.session.user = user;
            req.session.capabilities = map(cap, 'name');
            res.json(user);
          });
      });
    })(req, res, next);
  },

  signout (req, res) {
    req.logout();
    res.status(200).end();
  },

  isLoggedIn(req, res, next) {
    if (true || req.isAuthenticated()) {
      next();
    } else {
      res.status('401').json({ "error" : "Unauthorized" });
    }
  },

  canDo(capability, req) {
    return new Promise( (resolve, reject) => {
      includes(req.session.capabilities, capability) ? resolve() : reject({errors: 'forbidden'});
    });
  }
};
