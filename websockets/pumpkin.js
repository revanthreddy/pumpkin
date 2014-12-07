var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var dbConnection = require('./services/connector');
dbConnection.init();

server.listen(3000);

app.use(express.bodyParser());

var gamestate = require('./services/gamestate');

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


app.get('/games', function (req, res) {
    
    return res.status(200).send(gamestate.getCurrentGameState(1234));
});



io.sockets.on('connection', function (socket) {
    console.log("initialising socketio ..");
    socket.emit('server', {"key" : 1});
    
    socket.on('init', function (data) {
        gamestate.testingFunction(data,socket);
    });
   
});

app.post('/games', function (req, res) {
    var game = req.body;
    if(!game)
        return;
    game._id = game.game_id;
    var promise = gamestate.newGameState(game);
    if(!promise)
        return res.status(500).send("Internal server error");
    promise.then(function (gameState) {
        io.sockets.emit(game._id+"-init" , gameState);
    } , function (error) {
        console.log(error);
        return res.status(400).send("Fail");
    });
    //gamestate.gameMove(req.body);
    return res.status(200).send("Game state received");
});





