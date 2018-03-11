
/**
 * Mahesh Ranaweera (100555353)
 * SOFE4630U: Cloud Computing Assignment 2
 * Feb 25, 2018
 * 
 * App routing code
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
        //console.log(state.email);

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

/**Create Group */
router.post('/create_group', function(req, res, next){
    var group_name = req.body.groupName;

    data = {
        gname: group_name,
        uemail: sess.email
    }

    dbconn.createGroup(data, function(state){
        console.log(state)

        if(state == 1){
            res.redirect('/dashboard');
        }else{
            res.redirect('/dashboard?notify=error')
        }
    });
});

/**user dashboard */
router.get('/dashboard', function(req, res, next){
    /**Makesure user session exists */
    if (req.session.usersess) {
        username = sess.name;
        useremail = sess.email;

        //get users groups
        dbconn.getGroups(useremail, function(state){
            
            //console.log(state)
            //console.log(state[0])

            res.render('dashboard', {
                title: 'Dashboard',
                name: username,
                groups: state
            });
        }); 
    } else {
        res.redirect('/');
    }
});

/**user group */
router.get('/groupchat/:gid', function(req, res, next){
    /**Makesure user session exists */
    if (req.session.usersess) {
        username = sess.name;
        useremail = sess.email;

        //send group data
        data = {
            groupid: req.params.gid,
            uemail : useremail
        }

        dbconn.getGroupChat(data, function(state){

            if (state != null){
                res.render('groupchat', {
                    title: 'Group Chat',
                    name: username,
                    msg_data: state,
                    gdata: data
                });
            }else{
                //error page
                res.redirect('/notfound');
            }
        });
    } else {
        res.redirect('/');
    }
});

/**group not found */
router.get('/notfound', function(req, res, next){
    /**Makesure user session exists */
    if (req.session.usersess) {
        username = sess.name;
        useremail = sess.email;

        res.render('notfound', {
            title: 'Group Not Found',
            name: username
        });
    } else {
        res.redirect('/');
    }
});


/**join group */
router.post('/join_group', function(req, res, next){
    var group_id = req.body.groupID;

    data = {
        gid: group_id,
        uemail: sess.email
    }

    //validate the joinid
    if(data.gid.length == 36){
        dbconn.addGroup(data, function(state){
            //console.log(state)
    
            if(state == 1){
                res.redirect('/dashboard');
            }else if(state == -1){
                res.redirect('/dashboard?notify=registered');
            } else{
                res.redirect('/dashboard?notify=error');
            }
        });
    }else{
        res.redirect('/dashboard?notify=invalidid');
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