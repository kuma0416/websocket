const express = require('express');
const app = express();
//socket require
const server = require('http').Server(app);
const io = require('socket.io')(server);
let onlineCount = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
    onlineCount++;
    io.emit("online", onlineCount);

    socket.on('greet', function(){
        socket.emit("greet", onlineCount);
    });

    socket.on('send', function(msg){
        console.log(msg.name, msg.msg);
        if(Object.keys(msg).length < 2) return;

        io.emit("msg", msg);
    })

    socket.on('disconnect', function(){
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});

server.listen(3000, function(){
    console.log("sever listening on 3000.");
});