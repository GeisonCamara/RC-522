var http = require('http');
var port = 5000;
var ip = '192.168.1.142';
var rc522 = require("rc522");
var jsonfile = require('jsonfile');
var db = './database/db.json';
var io = require('socket.io')(server);
var id = 0;
var i = 0;
var show;

console.log("Pronto!");

rc522(function(rfidSerialNumber){
    console.log(rfidSerialNumber);
    id = rfidSerialNumber;
});

function checkUsers(data, rfid){
    for(i = 0; i < data.users.length; i++){
        if(id == data.users[i].rfid){
            return data.users[i].nome;
        }
    }
}

var server = http.createServer(function(req, res){
    jsonfile.readFile(db, function(err, data){
        if(err) throw err;
        var name = checkUsers(data, id);
        console.log(name);
        if(name != undefined){
            show = 'RFID: ' + name;
        } else {
            show = 'RFID não cadastrado';
        }
    });
});

io.sockets.on('connection', function(socket) {
    socket.object = socket.id;
    
        socket.on('updateObject', function(data) {
            io.sockets.clients('room').forEach(function (socket, data) {
                res.end(show);
            });
        });
    });

server.listen(port, ip, function(){
    console.log('Servidor iniciado em http://${ip}:${port}')
    console.log('Para finalizar o servidor pressione CTRL+C');
});