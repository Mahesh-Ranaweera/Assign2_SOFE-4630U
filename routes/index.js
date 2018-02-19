var express = require('express');
var router = express.Router();
var dbconn = require('../app/db');
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;