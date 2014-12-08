var dbConnection = require('../services/connector');
var Promise = require('promise');

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-36c7caed-38c0-4cfc-b283-1e63c8169d1f",
    subscribe_key : "sub-c-796bc1de-7e48-11e4-baaa-02ee2ddab7fe",
    secret_key    : 'sec-c-ZWZiYWFmMzQtNTM3OC00MzY3LWI4ZGYtNzcyNjY4YjI0MDkx'
});

exports.testingFunction = function(data,socket){
    socket.emit("server-response",data);
};


//new game state
exports.newGameState = function (game) {
    try{
    if(!game)
        return;
    game._id = game.game_id;
    var promise = new Promise(function (resolve, reject) {
        var db = dbConnection.getDbConnection();
        if (!db) {
            console.error("Failed to initialize the db.");
            reject("Failed to initialize the db.");
        }
        var collection = db.collection('games');

        collection.insert(game, function (err, record) {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(record);
            if(!record)
                reject(null);
            resolve(record[0]);

        });
    });

    return promise;
    }catch(ex){
        console.log(ex);
        return null;
    }
};


exports.getCurrentGameState = function (gameId) {
    var promise = new Promise(function (resolve, reject) {
        var db = dbConnection.getDbConnection();
        if (!db) {
            console.error("Failed to initialize the db.");
            reject("Failed to initialize the db.");
        }
        var collection = db.collection('games');
        collection.findOne({"_id": parseInt(gameId)}, function (err, record) {
            if (err) {
                console.log(err);
                reject(err);
            }
            
            console.log("record : "+record);
            if(!record)
                reject(null);
            resolve(record);

        });
    });

    return promise;
};

function doesTheCurrentGameStateHasTheQuestion(gameId, term_id) {

    var promise = new Promise(function (resolve, reject) {
        var db = dbConnection.getDbConnection();
        if (!db) {
            console.error("Failed to initialize the db.");
            reject("Failed to initialize the db.");
        }
        var collection = db.collection('games');

        collection.findOne({"_id": parseInt(gameId), "quiz.terms.id": term_id}, function (err, record) {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log("record : "+record);
            if(!record)
                reject(null);
            else
                resolve(record);

        });
    });

    return promise;
};

function isTheGameFinished(gameId){
    var promise = new Promise(function (resolve, reject) {
        var db = dbConnection.getDbConnection();
        if (!db) {
            console.error("Failed to initialize the db.");
            reject("Failed to initialize the db.");
        }
        var collection = db.collection('games');
        collection.findOne({"_id": parseInt(gameId)}, function (err, record) {
            if (err) {
                console.log(err);
                reject(err);
            }
            if(!record)
                reject("game already finished and deleted");
            resolve(record);

        });
    });

    return promise;
}


function deleteGame(gameId){
    var promise = new Promise(function (resolve, reject) {
        var db = dbConnection.getDbConnection();
        if (!db) {
            console.error("Failed to initialize the db.");
            reject("Failed to initialize the db.");
        }
        var collection = db.collection('games');
        collection.remove({"_id": parseInt(gameId)}, function (err, numberOfRemovedDocs) {
            if (err) {
                console.log(err);
                reject(err);
            }
            if(numberOfRemovedDocs === 0)
                reject(0);
            resolve(numberOfRemovedDocs);

        });
    });

    return promise;
}


exports.gameMove = function (playerAnswer ) {

    var gameState = doesTheCurrentGameStateHasTheQuestion(playerAnswer.game_id, playerAnswer.term_id);
    var gameResponse = new Object();
    gameState.then(function (currentGameState) {
        if (currentGameState) {
            var terms = currentGameState.quiz.terms;
            for (var i in terms) {
                if (terms[i].id === playerAnswer.term_id) {
                    if (terms[i].definition === playerAnswer.definition) {  //correct answer
                        terms.splice(i, 1);
                        
                        var players = currentGameState.players;
                        for(var j in players){
                            if(players[j].id === playerAnswer.player_id){
                                if(!players[j].score)
                                    players[j].score = 0;
                                players[j].score = 1+ players[j].score ;
                                var score = players[j].score*playerAnswer.rank;
                                var db = dbConnection.getDbConnection();
                                if (!db) {
                                    console.error("Failed to initialize the db.");
                                }
                                var collection = db.collection('games');
                                collection.save(currentGameState, function (err, numRecordsUpdated) {   
                                if (err) {
                                    console.log(err);
                                }
                                if(numRecordsUpdated > 0)
                                {
                                    gameResponse.game_id = playerAnswer.game_id;
                                    gameResponse.term_id = playerAnswer.term_id;
                                    gameResponse.answeredCorrectly = true;
                                    gameResponse.player = {"id" :playerAnswer.player_id , "score" : score } ;
                                    /*
                                     * 
                                     **/
                                    
                                    console.log(gameResponse);
                                    socket.emit(playerAnswer.game_id+"-state" , gameResponse);
                                    pubnub.publish({ 
                                            channel   : playerAnswer.game_id+'-state',
                                            message   : gameResponse,
                                            callback  : function(e) { connections[gameConnection.game_id] =null; },
                                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                                        });
                                        
                                    if(terms.size === 0 ){
                                        console.log("game finished");
                                        pubnub.publish({ 
                                            channel   : playerAnswer.game_id+'-finish',
                                            message   : true,
                                            callback  : function(e) { connections[gameConnection.game_id] =null; },
                                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                                        });
                                    }
                                }
                                else
                                {}
                            });
                            }
                        }
                       
                    } else { //wrong answer
                        var players = currentGameState.players;
                        for(var j in players){
                            if(players[j].id === playerAnswer.player_id){
                                if(!players[j].score)
                                    players[j].score = 0;
                                players[j].score =  players[j].score -1 ;
                                var score = players[j].score;
//                                console.log (players[j].score);
                                var db = dbConnection.getDbConnection();
                                if (!db) {
                                    console.error("Failed to initialize the db.");
                                }
                                var collection = db.collection('games');
                                collection.save(currentGameState, function (err, numRecordsUpdated) {   
                                if (err) {
                                    console.log(err);
                                    
                                }
                                if(numRecordsUpdated > 0)
                                {
                                    gameResponse.game_id = playerAnswer.game_id;
                                    gameResponse.term_id = playerAnswer.term_id;
                                    gameResponse.answeredCorrectly = false;
                                    gameResponse.player = {"id" : playerAnswer.player_id , "score" : score } ;
                                    gameResponse.alreadyAnswered = false;
                                    /*
                                     * 
                                     **/
                                    console.log(gameResponse);
                                    
                                    pubnub.publish({ 
                                            channel   : playerAnswer.game_id+'-state',
                                            message   : gameResponse,
                                            callback  : function(e) { connections[gameConnection.game_id] =null; },
                                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                                        });
                                }
                                else
                                {}
                            });
                            }
                        }
                    }
                }
            }
        }


    }, function (error) {
        console.log(error);
        var gameResponse = new Object();
        gameResponse.alreadyAnswered = true;
        console.log(gameResponse);
        //return null;
    });



};


