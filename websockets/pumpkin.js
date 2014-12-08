var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var connections= {};


var dbConnection = require('./services/connector');
dbConnection.init();

server.listen(3000);

app.use(express.bodyParser());

var gamestate = require('./services/gamestate');

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index_3.html');
});



app.post('/games', function (req, res) {
    
    var game = req.body;
    if(!game)
        return;
    game._id = game.game_id;
    var promise = gamestate.newGameState(game);
    if(!promise)
        return res.status(500).send("Internal server error");
    promise.then(function (gameState) {   //broadcasting the game
        
        
        if(connections[gameState.game_id]){
            if(connections[parseInt(gameState.game_id)] === gameState.players.length){
                console.log(connections[parseInt(gameState.game_id)]);
                pubnub.publish({ 
                    channel   : gameState.game_id+'-state',
                    message   : gameState,
                    callback  : function(e) { console.log( "SUCCESS!", e ); },
                    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                });
                connections[gameState.game_id] =null;
            }
        }

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




io.sockets.on('connection', function (socket) {
    console.log("initialising socketio ..");
    console.log("query... " + socket.manager.handshaken[socket.id].query.players);
    
    
    
//    var gameConnection = new Object();
//    gameConnection.game_id = socket.manager.handshaken[socket.id].query.game_id;
//    gameConnection.players = socket.manager.handshaken[socket.id].query.players;
//    
//    if(!connections[gameConnection.game_id])
//        connections[gameConnection.game_id] = 1;
//    else
//        connections[gameConnection.game_id] = connections[gameConnection.game_id] + 1;
//    
//    if(connections[gameConnection.game_id] == gameConnection.players){
//        var promise = gamestate.getCurrentGameState(gameConnection.game_id);
//        if(!promise)
//            return;
//        promise.then(function (gameState) {   //broadcasting the game
//            io.sockets.emit(gameState.game_id+'-state' , gameState);
//            connections[gameConnection.game_id]=null;
//        } , function (error) {
//            console.log(error);
//            return;
//        });
//    }
    
    socket.on('init', function (data) {
        
        gamestate.testingFunction(data.game_id,socket);
    });
    
    socket.on('solve' , function(gameMove){
       gamestate.gameMove(gameMove , socket);
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
    channel  : "start_game",
    callback : function(gameConnection) {
        
        console.log(gameConnection);
        
        if (!connections[gameConnection.game_id])
            connections[gameConnection.game_id] = 1;
        else
            connections[gameConnection.game_id] = connections[gameConnection.game_id] + 1;

        if (connections[gameConnection.game_id] == gameConnection.players) {
            var promise = gamestate.getCurrentGameState(gameConnection.game_id);
            if (!promise)
                return;
            promise.then(function (gameState) {   //broadcasting the game
                pubnub.publish({ 
                    channel   : gameState.game_id+'-state',
                    message   : gameState,
                    callback  : function(e) { connections[gameConnection.game_id] =null; },
                    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                });
                
                
                
            }, function (error) {
                console.log(error);
                return;
            });
        }
        
        
        
        
        
    }
});




