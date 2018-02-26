var http = require('http');
var port = 5000;
var ip = 'localhost';
var rc522 = require("rc522");
var jsonfile = require('jsonfile');
var db = './database/db.json';
var id = 0;
var i = 0;

console.log("Pronto!");

rc522(function(rfidSerialNumber){
    console.log(rfidSerialNumber);
    id = rfidSerialNumber;
});

var server = http.createServer(function(req, res){
    jsonfile.readFile(db, function(err, data){
    if(err){
        throw err;
    }
    else{
        for(i = 0; i < data.users.length; i++){
            if(id == data.users[i].rfid){
                console.log(data.users[i].nome);
                res.end('RFID: ' + data.users[i].nome);
            }
        }
    }
    });
});

server.listen(port, ip, function(){
    console.log('Servidor iniciado em http://${ip}:${port}')
    console.log('Para finalizar o servidor pressione CTRL+C');
});