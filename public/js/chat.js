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
    var metadata = JSON.parse($('#chat_data').val());
    var chatCont = $('#chatContainer');

    socket.emit('joinroom', metadata.groupid);

    $('#chatroom').submit(function(e){
        var url = '/sendmsg';
        var chatdata = {
            meta: metadata,
            msg : $('#chat_msg').val(),
            stamp: Date.now()
        }
        //console.log(chatdata);

        //maksure chat data is available to send and clear input
        if(chatdata.msg != ''){
            socket.emit('chatdata', chatdata);
            $('#chat_msg').val('');
        }

        e.preventDefault();
    })

    socket.on('recievedata', function(data){
        //console.log(data);

        msgs = '';
        if(data.from == metadata.uemail)
            msgs += '<div class="chat-row"><div class="chat-me" title="'+data.from+'">\
            <div class="chat-msg">'+data.msg+'</div><div class="chat-img"></div></div></div>';
        else    
            msgs += '<div class="chat-row"><div class="chat-other" title="'+data.from+'">\
            <div class="chat-img"></div><div class="chat-msg">'+data.msg+'</div></div></div>';

        chatCont.append(msgs);
        updateScroll();
    });

    socket.on('clients', function(data){
        console.log(data);
    });
});