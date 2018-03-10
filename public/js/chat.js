//onload execute functions
window.onload = function(){
    updateScroll();
}

//update chat scroll
function updateScroll(){
    var chatCont = document.getElementById('chatContainer');
    var height   = chatCont.scrollHeight;
    chatCont.scrollTop = height;
    console.log("chatwindow-height", height);
}

//chat submit::handle using sockets
$(function (){
    var socket = io();

    $('#chatroom').submit(function(e){
        var url = '/sendmsg';
        var chatdata = {
            meta: $('#chat_data').val(),
            msg : $('#chat_msg').val(),
            stamp: Date.now()
        }
        console.log(chatdata);

        //maksure chat data is available to send and clear input
        if(chatdata.msg != ''){
            socket.emit('chatdata', chatdata);
            $('#chat_msg').val('');
        }

        e.preventDefault();
    })

    socket.on('dbchats', function(data){
        console.log(data);

        updateScroll();
    });

    sockets.on('clients', function(data){
        console.log(data);
    });
});