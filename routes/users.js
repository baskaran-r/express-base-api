var express = require('express');
const passport = require('passport');
var db = require('../utils/db');
const {
  handleError,
  currentTimeStamp,
  asyncWrap,
  logWarn,
  validate
} = require('../utils/common');

const userRoute = module.exports = {

  list: asyncWrap(async function (req, res, next) {
    let queryParams = req.query || {};
    let filters = ["status = 'active'"];

    for(let key in queryParams) {
      filters.push(`${key} = ${queryParams[key]}`)
    }

    let users = await db.exec("select * from users WHERE " + filters.join(' AND '));
    res.json({users});
  }),

  findById(req, res) {
    let id = req.params.id;
    return new Promise(function(resolve, reject) {

      db.exec("select * from users WHERE id=?", [id]).then(user => {
        if (user.length !== 1) {
          let error = { errors: [{
            title: 'User not Location'
          }]};
          handleError(res, error, 400 ); return;
        }
        resolve(user[0]);
      }).catch( error => {
        reject(error);
      })
    });
  },

  findOne: asyncWrap(async function(req, res, next) {

    try {
      const user = await userRoute.findById(req, res);

      res.json({user});
    } catch (err) {
      handleError(res, err, 400);
    }
  }),
};
