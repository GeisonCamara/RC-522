var rc522 = require("rc522");

rc522(function(rfidSerialNumber){
    id = rfidSerialNumber;
    // io.emit('read rfid', function(id){
    //     console.log('Lido: ' + id);
    // });
    console.log('Lido: ' + id);
});

module.exports = rc522;