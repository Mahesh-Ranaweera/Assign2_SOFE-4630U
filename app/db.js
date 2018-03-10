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
var tbgroups= "groups";

/**Setting up the app tables */
// create user table
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

/**Create table groups */
r.db(dbname).tableList().contains(tbgroups)
    .do(function(dbTableExists) {
        return r.branch(
            dbTableExists, {
                tables_created: 0
            },
            r.db(dbname).tableCreate(tbgroups, {
                primaryKey: 'groupid'
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
                    'passw': data.passw,
                    'groups': []
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

/**USER  getuser*/
var getUSER = function(useremail, callback){
    //get user data based on user email
    r.db(dbname).table(tbusers).get(useremail).run()
        .then(function(response){
           // console.log(response);

            if(response == null){
                callback(null);
            }else{
                callback(response);
            }
        }).catch(function(err){
            console.log(err);
        });
}

/**Create Group */
var createGroup = function(data, callback){
    //console.log(data)

    //insert the group data
    r.db(dbname).table(tbgroups).insert({
        'groupname': data.gname,
        'owner': data.uemail ,
        'groupmembers': [data.uemail],
        'groupchat': []
    }).run()
    .then(function(response){
        r.db(dbname).table(tbusers).get(data.uemail)
            .update({
                'groups': r.row('groups').append({
                    'groupid': response.generated_keys[0]
                })
            }).run()
        .then(function (resp){
            callback(1);
        })
        .catch(function(err){
            callback(0);
        })
    })
    .catch(function(err){
        callback(0);
    });
}

var getGroups = function(uemail, callback){
    //get groups for the user
    var g = [];
    r.db(dbname).table(tbusers).get(uemail).getField('groups').run()
    .then(function(response){
        //console.log(response);

        //get group info for each group
        for (i = 0; i  < response.length; i++){
            //console.log(response[i].groupid)
            g.push(response[i].groupid);
        }

        r.db(dbname).table(tbgroups).getAll(r.args(g)).run()
        .then(function(resp){
            callback(resp);
        })
        .catch(function(err){
            callback(null);
        })
    })
    .catch(function(err){
        callback(null);
    });
}

var getGroupChat = function(data,callback){
    console.log(data)
    //get specific group data
    r.db(dbname).table(tbgroups).get(data.groupid).run()
    .then(function(response){

        var members = response.groupmembers;
        var found = false;

        //makesure user enroled in the group
        for(i = 0; i < members.length; i++){
            //console.log(members[i]);
            //compare email
            if (members[i] == data.uemail)
                found = true;
        }

        if(found){
            callback(response);
        }else{
            callback(null);
        }
    })
    .catch(function(err){
        callback(null);
    })
}

var addGroup = function(data, callback){
    //add the given id to users group list
    r.db(dbname).table(tbusers).get(data.uemail).run()
    .then(function(response){
        //get user groups
        var usergroups = response.groups;
        var found = false;

        //go through array an check user is already has the group
        for(i = 0; i < usergroups.length; i++){
            if(usergroups[i].groupid === data.gid)
                found = true;
        }

        //if found send already registered
        if(found){
            //already in group
            callback(-1);
        }else{
            //add group to users and email to members
            r.expr([
                r.db(dbname).table(tbusers).get(data.uemail)
                .update({
                    'groups': r.row('groups').append({
                        'groupid': data.gid
                    })
                }),
                r.db(dbname).table(tbgroups).get(data.gid)
                .update({
                    'groupmembers': r.row('groupmembers').append(data.uemail)
                })]
            ).run()
            .then(function (resp){
                callback(1);
            })
            .catch(function(err){
                callback(0);
            })
        }
    })
    .catch(function(err){
        callback(0);
    });
}

/**manage chat data */


/**Export the modules */
module.exports.addUSER = addUSER;
module.exports.getUSER = getUSER;
module.exports.createGroup = createGroup;
module.exports.getGroups = getGroups;
module.exports.getGroupChat = getGroupChat;
module.exports.addGroup = addGroup;