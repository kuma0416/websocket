const express = require('express');
const app = express();
//socket require
const server = require('http').Server(app);
const io = require('socket.io')(server);
const records = require('./record.js');
let onlineCount = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
    onlineCount++;
    io.emit("online", onlineCount);//return the oneline people number
    socket.emit("maxRecord", records.getMax());//return the max records number
    socket.emit("chatRecord", records.get());//return the chat racords in the before
    
    /*socket.on('greet', function(){
        socket.emit("greet", onlineCount);
    });*/

    socket.on('send', function(msg){
        if(Object.keys(msg).length < 2) return;

        records.push(msg);
        //io.emit("msg", msg);
    })

    socket.on('disconnect', function(){
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});

records.on('new_message', function(msg){
    io.emit("msg", msg);
})

server.listen(3000, function(){
    console.log("sever listening on 3000.");
});