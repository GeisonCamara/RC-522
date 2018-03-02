var http = require('http');
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var port = 5000;
var rc522 = require("rc522");
var jsonfile = require('jsonfile');
var db = './database/db.json';

var path = require('path');
var notifier = require('node-notifier');

var id = 0;
var msg = '';

var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

function checkUsers(data, rfid){
    var userName = "";
    for(var i = 0; i < data.users.length ; i++){
        if(data.users[i].rfid == rfid){
            userName =  data.users[i].nome;
        }
    }

    return userName != "" ? userName : "Não encontrado";
}

app.get('/', function(req, res){
    res.render('index', {rfid: msg});
});

var conections = 0;
io.sockets.on('connection', function(socket){
    notifier.notify({
        title: 'Um meliante se conectou',
        message: 'KKKKKKK'
    });
    console.log('Usuários conectados: ' + (++conections));
    socket.on('disconnect', function(){
        console.log('Usuários conectados: ' + (--conections));
    });
});

rc522(function(rfidSerialNumber){
    jsonfile.readFile(db, function(err, data){
        if(err) throw err;
        id = rfidSerialNumber;
        msg = checkUsers(data, id);
        io.sockets.emit('read rfid', msg);
        io.sockets.emit('generated notification', msg);
        console.log('_______________________________________');
        console.log(id);
        console.log(msg);
        console.log('_______________________________________\n\n');
    });
});

server.listen(port, function(){
    console.log('Servidor iniciado: http://localhost:' + port);
});