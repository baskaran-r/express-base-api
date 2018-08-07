let env = {
  "development": {
    "mysql": {
      "host": "localhost",
      "port": 3306,
      "user": "",
      "password": "",
      "database": "base"
    }
  },
  "production": {
    "mysql": {
      "host": "localhost",
      "port": 3306,
      "user": "",
      "password": "",
      "database": "base"
    }
  }
};

let isProd = process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'production';
module.exports = env[isProd ? 'production' : 'development'];
