var express = require('express');
var exphbs = require('express-handlebars');
var port = 5000;
var rc522 = require("rc522");
var jsonfile = require('jsonfile');
var db = './database/db.json';

var id = 0;
var msg = '';

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

function checkUsers(data, rfid){
    console.log('_______________________________________');
    console.log('3 - data e rfid');
    console.log(data);
    console.log(rfid);
    console.log('_______________________________________');
    for(var i = 0; i < data.users.length; i++){
        console.log('_______________________________________');
        console.log('4 - itens');
        console.log(i + ': ' + data.users[i].rfid);
        console.log('_______________________________________');
        if(data.users[i].rfid == rfid){
            return data.users[i].nome;
        } else {
            return 'Não encontrado';
        }
    }
}

app.get('/', function(req, res){
    res.render('index', {rfid: msg});
});

io.on('connection', function(socket){
    console.log('Um usuário se conectou!');
    socket.on('disconnect', function(){
        console.log('Um usuário se desconectou!');
    })
});

rc522(function(rfidSerialNumber){
    console.log('_______________________________________');
    console.log('1 - rfidSerialNumber: ' + rfidSerialNumber);
    console.log('_______________________________________');
    jsonfile.readFile(db, function(err, data){
        console.log('_______________________________________');
        console.log('2 - Data: ');
        console.log(data);
        console.log('_______________________________________');
        if(err) throw err;
        id = rfidSerialNumber;
        msg = checkUsers(data, id);
        console.log('_______________________________________');
        console.log('5 - id e msg');
        console.log(id);
        console.log(msg);
        console.log('_______________________________________');
    });
});

http.listen(port, function(){
    console.log('Servidor iniciado: http://localhost:' + port);
});