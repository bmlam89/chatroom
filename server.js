var express = require('express');
var path = require('path');
var app = express();

app.set('views',path.join(__dirname+'/views'));
app.set('view engine','ejs');

var users = {};
var post = {};
var idx = 0;

app.get('/',function(request,response){
    response.render('index');
});

var server = app.listen(8000,function(){
    console.log('listening on port 8000');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){
    console.log('connected!',socket.id);

    socket.on('get_chat_history',function(request){
        users[socket.id]=request.name;
        var chat_history = post;
        socket.emit('post_chat_history',{chat_history:chat_history});
    });

    socket.on('submitted_msg',function(request){
        post[idx] = {name:request.name,msg:request.msg};
        idx++;
        io.emit('posted_message',{name:users[socket.id],msg:request.msg});
    });
});

