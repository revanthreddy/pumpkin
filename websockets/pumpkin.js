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
    res.sendfile(__dirname + '/index_1.html');
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

app.get('/games/:id', function (req, res) {
    var gameId = req.param('id');
    if (!gameId)
        return res.status(400).send("failed to retrieve");
    var promise = gamestate.getCurrentGameState(gameId);
    promise.then(function (gameState){
        return res.status(200).send(gameState);
    } , function (error){
        return res.status(400).send("failed with "+error);
    });

});



/*
 * 
 * 
 * 
 * 
 **/
var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-36c7caed-38c0-4cfc-b283-1e63c8169d1f",
    subscribe_key : "sub-c-796bc1de-7e48-11e4-baaa-02ee2ddab7fe",
    secret_key    : 'sec-c-ZWZiYWFmMzQtNTM3OC00MzY3LWI4ZGYtNzcyNjY4YjI0MDkx'
});




pubnub.subscribe({
    channel  : "my_response",
    callback : function(message) {
        console.log(message);
        pubnub.publish({ 
            channel   : 'from_server_again',
            message   : {"color" : "greeen"},
            callback  : function(e) { console.log( "SUCCESS!", e ); },
            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
        });
    }
});



app.get('/pubnub', function (req, res) {
    pubnub.publish({ 
            channel   : 'from_server',
            message   : {"color" : "greeen"},
            callback  : function(e) { console.log( "SUCCESS!", e ); },
            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
        });
    return res.status(200).send("pubnub received");
});





