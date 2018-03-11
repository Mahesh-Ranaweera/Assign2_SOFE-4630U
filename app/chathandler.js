/**Socket handler */
var dbconn = require('../app/db');
var APIcalls = require('../app/regex');

/**Sockets */
module.exports = function(server){
    var io = require('socket.io')(server);
    var joingroup = null;

    io.on('connection', function(socket){
        console.log(' %s sockets connected : %s conn id', io.engine.clientsCount, socket.conn.id);

        //join the room
        socket.on('joinroom', function(room){
            socket.join(room);
        });

        //add chat to db
        socket.on('chatdata', function(chatdata){
            //console.log(chatdata);

            APIcalls.getInfo(chatdata.msg, function(data){
                console.log(data);
            })

            dbconn.insertChat(chatdata, function(state){
                //console.log(state);
                if(state == 1){

                    var msg = {
                        stamp: chatdata.stamp,
                        from: chatdata.meta.uemail,
                        msg: chatdata.msg
                    }
                    //broadcast to everyone
                    io.sockets.in(chatdata.meta.groupid).emit('recievedata', msg);
                }
            })
            
        });

        //disconnect user
        socket.on('disconnect', function(){
            console.log('user disconnect');
            //socket.leave(chatdata.meta.groupid);
        });
    });
}