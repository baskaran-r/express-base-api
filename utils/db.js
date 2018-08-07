let mysql = require('mysql');
let env = require('../config/environment');
let pool = mysql.createPool(env.mysql);


exports.exec = function(query, params, callback) {
  return new Promise( function(resolve, reject) {
    if (!query) {
      reject(new Error("SQL Query not found"));
    }
    pool.getConnection(function(connectionErr, connection) {
      if(connectionErr) { console.log(connectionErr); reject(connectionErr); }
      var q = connection.query(query, params, function(err, results) {
        connection.release();
        if(err) { console.log(err); reject(err); }
        resolve(results);
      });
      console.log("Query: ",q.sql);
    });
  });
};
