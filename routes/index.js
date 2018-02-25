
/**
 * Mahesh Ranaweera (100555353)
 * SOFE4630U: Cloud Computing Assignment 2
 * Feb 25, 2018
 * 
 * App routing
 */

var express = require('express');
var router = express.Router();
var dbconn = require('../app/db');
var encrypt = require('../app/encrypt');
var session = require('express-session');

//set the session
router.use(session({
    secret: 'HV3U00lcMahc84050VxX62xoMS67NhS4',
    resave: false,
    saveUninitialized: true,
    path: '/'
}));

//start a session 
var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
    /**Redirect user if session exists */
    if (req.session.usersess) {
        res.redirect('/dashboard');
    } else {
        res.render('index', {
            title: 'Home'
        });
    }
});

/*user login page */
router.get('/signup', function(req, res, next) {
    var alert = null;

    if(req.query.notify != null){
        alert = req.query.notify;
    }

    res.render('signup', {
        title: 'Signup',
        alert: alert
    });
});

/**New user signup */
router.post('/user_signup', function(req, res, next){
    var email = req.body.strEmail.toLowerCase();
    var fname = req.body.strFname;
    var lname = req.body.strLname;

    var passw1 = req.body.strPassw1;
    var passw2 = req.body.strPassw2;

    if(passw1 == passw2){
        console.log('login');

        data = {
            email: email,
            fname: fname,
            lname: lname,
            passw: encrypt.passwHASH(passw1)
        }

        /**Add data to db */
        dbconn.addUSER(data, function(state){
            if(state == 1){
                //console.log('Entered');
                res.redirect('/signup?notify=success');
            } else if(state == -1){
                //console.log('Duplicate');
                res.redirect('/signup?notify=duplicate');
            } else{
                //console.log('Error');
                res.redirect('/signup?notify=error');
            }
        });
    }else{
        res.redirect('/signup?notify=passw');
    }
});

/**user signin page */
router.get('/signin', function(req, res, next){
    var alert = null;

    if(req.query.notify != null){
        alert = req.query.notify;
    }

    res.render('signin', {
        title: 'Signin',
        alert: alert
    });
});

/**User signin */
router.post('/user_signin', function(req, res, next){
    var email = req.body.strEmail.toLowerCase();
    var passw = req.body.strPassw;

    dbconn.getUSER(email, function(state){
        console.log(state.email);

        /**check if user exists */
        if(state != null){
            if(state.email == email && encrypt.compareHASH(passw, state.passw)){
                /**Create a user session */
                sess = req.session;
                sess.usersess = true;
                sess.email = state.email;
                sess.name  = state.fname + ' ' + state.lname;

                res.redirect('/dashboard');
            }else{
                res.redirect('/signin?notify=passw');
            }
        }else{
            res.redirect('/signin?notify=notfound');
        }
    });
});

/**user signup post */
router.post('/signup_user', function(req, res, next) {

});

/**user dashboard */
router.get('/dashboard', function(req, res, next){
    /**Makesure user session exists */
    if (req.session.usersess) {
        username = sess.name;
        useremail = sess.email;

        res.render('dashboard', {
            title: 'Dashboard',
            name: username
        });
    } else {
        res.redirect('/');
    }
});


/**SIGNOUT */
router.get('/signout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;