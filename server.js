var http = require('http');
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var path = require('path');
var server = http.createServer(app);
var port = 5000;
var io = require('socket.io').listen(server);

var jsonfile = require('jsonfile');
var db = './database/db.json';
var rc522 = require("rc522");
var id = "0";

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.configure(function(){
    app.set('port', process.env.PORT || port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'handlebars');
    // app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
});

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

io.sockets.on('connection', function(socket){
    console.log('Um usuário se conectou!');
    socket.on('disconnect', function(){
        console.log('Um usuário se desconectou!');
    });
    socket.on('read rfid', function(rfid){
        console.log('Última leitura: ' + rfid);
    });
});

rc522(function(rfidSerialNumber){
    id = rfidSerialNumber;
    io.emit('read rfid', function(id){
        console.log('Lido: ' + id);
    });
    // socket.emit('read rfid', id);
});


http.listen(port, function(){
    console.log('Servidor iniciado: http://localhost:' + port);
});