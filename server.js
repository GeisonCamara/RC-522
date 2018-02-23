var rc522 = require("rc522");

console.log("Pronto!");

rc522(function(rfidSerialNumber){
    console.log(rfidSerialNumber);
});
