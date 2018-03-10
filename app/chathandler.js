/**Socket handler */
var db = require('../app/db');

/**Sockets */
module.exports = function(server){
    var io = require('socket.io')(server);

    io.on('connection', function(socket){
        console.log(' %s sockets connected : %s conn id', io.engine.clientsCount, socket.conn.id);

        socket.on('chatdata', function(chatdata){
            console.log(chatdata);

            
        })

        socket.on('disconnect', function(){
            console.log('user disconnect');
        })
    });
}