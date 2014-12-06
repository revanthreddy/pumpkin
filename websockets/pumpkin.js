var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var dbConnection = require('./services/connector');
dbConnection.init();

server.listen(3000);

app.use(express.bodyParser());


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {
    console.log("initialising socketio ..");
    socket.emit('server', {"key" : 1});
    
    socket.on('init', function (data) {
        
    });
    
});


