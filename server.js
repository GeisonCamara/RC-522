var http = require('http');
var express = require('express');
var app = express();
var exphbs = require('express3-handlebars');var path = require('path');
var server = http.createServer(app);
var port = 5000;
var io = require('socket.io').listen(server);







}


});


io.sockets.on('connection', function(socket){
    console.log('Um usuário se conectou!');
    socket.on('disconnect', function(){
        console.log('Um usuário se desconectou!');
    });
    socket.on('read rfid', function(rfid){
        console.log('Última leitura: ' + rfid);
    });
});





});