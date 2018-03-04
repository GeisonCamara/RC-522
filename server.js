var http = require('http');
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var path = require('path');
var port = 7000;
var rc522 = require("rc522");
var jsonfile = require('jsonfile');
var db = './database/db.json';
var helpers = require('./helpers/helpers');

var id = 0;
var msg = '';

var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: helpers
});

hbs.getTemplates('views/partials/', {
    cache: app.enabled('view cache'),
    precompiled: true
}).then(function(templates){
    var extRegex = new RegExp(hbs.extname, '$');
    var partials = {};
    Object.keys(templates).map(function(name){
        partials[name.replace(extRegex, '')] = templates[name];
        return partials;
    });
    if (templates.length) {
        hbs.handlebars.partials = partials;
    }
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'content')));

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
        io.emit('generated notification', msg);
        console.log('_______________________________________');
        console.log(id);
        console.log(msg);
        console.log('_______________________________________\n\n');
    });
});

server.listen(port, function(){
    console.log('Servidor iniciado: http://localhost:' + port);
});