var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var fs = require('fs');

var exphbs = require('express-handlebars');
var path = require('path');
var port = 5000;
var rc522 = require("rc522");
var jsonfile = require('jsonfile');
var db = './database/db.json';
var helpers = require('./helpers/helpers');

var id = 0;
var msg = '';

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/notifyjs/dist')));
app.use('/js', express.static(path.join(__dirname, '/content')));

console.log(path.join(__dirname, '/node_modules/jquery/dist'));
console.log(path.join(__dirname, '/node_modules/notifyjs/dist'));

function checkUsers(data, rfid) {
    var userName = "";
    for (var i = 0; i < data.users.length; i++) {
        if (data.users[i].rfid == rfid) {
            userName = data.users[i].nome;
        }
    }
    return userName != "" ? userName : "Não encontrado";
}

app.get('/', function (req, res) {
    res.render('index', { rfid: msg });
});

var PROD = false;
var lex = require('greenlock-express').create({
    server: PROD ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',
    approveDomains: (opts, certs, cb) => {
        if (certs) {
            opts.domains = ['coffelytics.com', 'coffelytics.com']
        } else {
            opts.email = 'coffelytics@gmail.com';
            opts.agreeTos = true;
        }
        cb(null, { options: opts, certs: certs });
    }
});
var middlewareWrapper = lex.middleware;

var server = https.createServer(
    lex.httpsOptions,
    middlewareWrapper(app)
);
var io = require('socket.io').listen(server);

var conections = 0;
io.sockets.on('connection', function (socket) {
    console.log('Usuários conectados: ' + (++conections));
    socket.on('disconnect', function () {
        console.log('Usuários conectados: ' + (--conections));
    });
});

rc522(function (rfidSerialNumber) {
    jsonfile.readFile(db, function (err, data) {
        if (err) throw err;
        id = rfidSerialNumber;
        msg = checkUsers(data, id);
        io.sockets.emit('read rfid', msg);
        console.log('_______________________________________');
        console.log(id);
        console.log(msg);
        console.log('_______________________________________\n\n');
    });
});

server.listen(port, function () {
    console.log('Servidor iniciado: https://localhost:' + port);
});