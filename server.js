var http = require('http');
var port = 5000;
var ip = '192.168.1.119';
var rc522 = require("rc522");

var id = 0;
console.log("Pronto!");

rc522(function(rfidSerialNumber){
    console.log(rfidSerialNumber);
    id = rfidSerialNumber;
});

var server = http.createServer(function(req, res){
    res.end('RFID: ' + id);
});

server.listen(port, ip, function(){
    console.log('Servidor iniciado em http://${ip}:${port}')
    console.log('Para finalizar o servidor pressione CTRL+C');
});
