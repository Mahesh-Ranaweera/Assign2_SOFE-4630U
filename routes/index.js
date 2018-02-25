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

/**user signin page */
router.get('/signin', function(req, res, next){
    res.render('signin', {
        title: 'Signin'
    });
});

/**user signup post */
router.post('/signup_user', function(req, res, next) {

});

/**user dashboard */
router.get('/dashboard', function(req, res, next){
    res.render('dashboard', {
        title: 'Dashboard'
    });
});

module.exports = router;