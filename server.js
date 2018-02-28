var express = require('express');
var exphbs = require('express-handlebars');
var port = 5000;
var rc522 = require("rc522");
var jsonfile = require('jsonfile');
var db = './database/db.json';
var id = "0";

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

function checkUsers(data, rfid){
    for(var i = 0; i < data.users.length; i++){
        if(data.users[i].rfid == rfid){
            return data.users[i].nome;
        }
    }
}

app.get('/', function(req, res){
    jsonfile.readFile(db, function(err, data){
        if(err) throw err;
        var name = checkUsers(data, id);
        if(name != undefined){
            res.render('index', {rfid: name});
        } else {
            res.render('index', {rfid: 'Não encontrado'});
        }
    });
});

rc522(function(rfidSerialNumber){
    console.log('Lido: ' + rfidSerialNumber);
    id = rfidSerialNumber;
});

io.on('connection', function(socket){
    console.log('Um usuário se conectou!');
    socket.on('disconnect', function(){
        console.log('Um usuário se desconectou!');
    });
});

http.listen(port, function(){
    console.log('Servidor iniciado: http://localhost:' + port);
});