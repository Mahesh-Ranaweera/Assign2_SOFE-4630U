var express = require('express');
var router = express.Router();
var dbconn = require('../app/db');
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Home'
    });
});

/*user login page */
router.get('/signup', function(req, res, next) {
    res.render('signup', {
        title: 'Signup'
    });
});

/**user signup post */
router.post('/signup_user', function(req, res, next) {

});

module.exports = router;