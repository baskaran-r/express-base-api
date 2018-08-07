const moment = require('moment');
const debug  = require('debug');
const _      = require('lodash');
const env    = require('../config/environment');

const commonUtil = module.exports = {
  handleError (res, err, code) {
    console.log(err);
    if (code === 500 && !err) {
      err = "Internar Error";
    }
    res.status(code).json(err);
  },

  currentTimeStamp () {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },

  asyncWrap(fn) {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    }
  },

  logWarn (message) {
    debug(message);
  },

  validate(obj, rules) {
    let errors = [];
    return new Promise((resolve, reject)  => {
      _.forEach(rules, (rule, field) => {
        if (_.isPlainObject(rule)) {
          commonUtil.logWarn("rule not found" + rule);
          //return false;
        }

        _.forIn(rule, (value, key) => {
          let valueType = typeof(value);
          let message = '';
          if (valueType === 'string') {
            message = value;
          } else if (valueType === 'object') {
            message = value.message;
          }

          let result = commonUtil.validateRule[key](obj, field, key, value, message)
          if (!result.pass) {
            errors.push({field: field, message: result.message});
            return false;
          }
        });

      });

      errors.length === 0 ? resolve() : reject({errors: errors});
    });
  },

  validateRule: {
    required: (obj, field, key, value, message) => {
      return {
        pass: _.has(obj, field),
        message: message || `${field} is required`
      };
    },
    notrequired: (obj, field, key, value, message) => {
      return {
        pass: !_.has(obj, field),
        message: message || `${field} must be empty`
      };
    },
    numeric: (obj, field, key, value, message) => {
      return {
        pass: _.isInteger(obj[field]),
        message: message || `${field} must be an numeric`
      };
    },
    email: (obj, field, key, value, message) => {
      return {
        pass: /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(obj[field]),
        message: message || `${field} must be an email`
      };
    },
  }
}
