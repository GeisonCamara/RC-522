var express = require('express');
var router = express.Router();

function checkUsers(data, rfid){
    for(var i = 0; i < data.users.length; i++){
        if(data.users[i].rfid == rfid){
            return data.users[i].nome;
        }
    }
}

router.get('/', function(req, res){
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

module.exports = router;