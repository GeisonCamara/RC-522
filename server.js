var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var path = require('path');
var server = http.createServer(app);
var port = 5000;
var io = require('socket.io').listen(server);
var rfid = require('./controllers/rfid');
var helpers = require('./helpers/helpers');

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

var index = require('./routes/index');

app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());
app.use(helpers.relativePath() + '/content', express.static(path.join(__dirname, '..', 'content')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

if (app.get('env') !== 'development') {
    app.enable('view cache');
}

app.use(helpers.relativePath() + '/', index);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((error, request, response) => {
    // set locals, only providing error in development
    const err = error;
    const req = request;
    const res = response;
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
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

app.use(rfid);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`WebService has started on ${app.get('port')} running in ${app.get('env')} mode`);
  if (app.get('env') === 'development') {
    console.log('PLEASE NOTE: your webservice is running not in a production mode!');
  }
});