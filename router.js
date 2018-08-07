const express = require('express');
const router = express.Router();

const index        = require('./routes/index');
const session      = require('./routes/session');
const users        = require('./routes/users');

router.get('/', index.home);
router.post('/login', session.signin);
router.delete('/logout', session.isLoggedIn, session.signout);

router.get('/users', session.isLoggedIn, users.list);
router.get('/users/:id', session.isLoggedIn, users.findOne);

module.exports = router;
