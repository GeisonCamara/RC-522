const rc522 = require("rc522");
const http = require('http')
const port = 3000
const ip = 'localhost'

rc522(function(rfidSerialNumber){
    console.log(rfidSerialNumber);
});

const server = http.createServer((req, res) => {
    res.end('RF-522');
});

server.listen(port, ip, () => {
    console.log(`Servidor rodando em http://${ip}:${port}`)
    console.log('Para encerrar o servidor: ctrl + c');
});