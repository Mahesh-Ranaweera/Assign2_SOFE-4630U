/**
 * Handles database connections
 */

var connection = null;
var r = require('rethinkdbdash')({
    port: 28015,
    host: 'localhost'
}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

/**DB tables */
var dbname = "app_db";
var tbusers = "users";

/**Setting up the app tables */
r.dbList().contains(dbname)
    .do(function(dbExists) {
        return r.branch(
            dbExists, {
                dbs_created: 0
            },
            r.dbCreate(dbname)
        );
    }).run();

/**Create table users */
r.db(dbname).tableList().contains(tbusers)
    .do(function(dbTableExists) {
        return r.branch(
            dbTableExists, {
                tables_created: 0
            },
            r.db(dbname).tableCreate(tbusers, {
                primaryKey: 'email'
            }));
    }).run();


/**USER signup */
var addUSER = function(data, callback) {
    //check if email exists
    r.db(dbname).table(tbusers).get(data.email).run()
        .then(function(response) {
            if (response == null) {
                console.log('user not exists');

                //insert the new user
                r.db(dbname).table(tbusers).insert({
                    'email': data.email,
                    'fname': data.fname,
                    'lname': data.lname,
                    'verified': false,
                    'passw': hash
                }).run();

                callback(1);
            } else {
                console.log('user found');
                callback(-1);
            }
        }).catch(function(err) {
            callback(0);
        });
};

/**Export the modules */
module.exports.addUSER = addUSER;