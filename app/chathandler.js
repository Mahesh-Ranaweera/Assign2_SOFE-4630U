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

            //check the text for any commands
            APIcalls.getInfo(chatdata.msg, function(data){
                //console.log(data);
                /**Handling messages based on tags
                 * text: normal text message
                 * note: notes
                 * wheather: get wheather info
                 */
                var chat = {stamp: null, from: null, msg: null, tag: null}

                if(data != null){
                    //organize the sending data
                    chat = {
                        stamp: chatdata.stamp,
                        from: chatdata.meta.uemail,
                        msg: data.content,
                        tag: data.tag,
                        groupid: chatdata.meta.groupid
                    }
                }else{
                    chat = {
                        stamp: chatdata.stamp,
                        from: chatdata.meta.uemail,
                        msg: chatdata.msg,
                        tag: 'text',
                        groupid: chatdata.meta.groupid
                    }
                }

                //console.log(chat);
                //send the message to frontend
                dbconn.insertChat(chat, function(state){
                    //console.log(state);
                    if(state == 1){
                        //broadcast to everyone
                        io.sockets.in(chatdata.meta.groupid).emit('recievedata', chat);
                    }
                });

            });    
        });

        //disconnect user
        socket.on('disconnect', function(){
            console.log('user disconnect');
            //socket.leave(chatdata.meta.groupid);
        });
    });
}