var express = require('express');
var exphbs = require('express-handlebars');
var port = 5000;
var rc522 = require("rc522");
var jsonfile = require('jsonfile');
var db = './database/db.json';
var id = "90152629";

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
    rc522(function(rfidSerialNumber){
        jsonfile.readFile(db, function(err, data){
            if(err) throw err;
            var name = checkUsers(data, rfidSerialNumber);
            console.log(name);
            if(name != undefined){
                res.render('index', {rfid: name});
            } else {
                res.render('index', {rfid: 'Não encontrado'});
            }
        });
    });
});

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(port, function(){
    console.log('Servidor iniciado: http://localhost:' + port);
});