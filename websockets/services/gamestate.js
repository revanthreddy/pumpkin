var dbConnection = require('../services/connector');
var Promise = require('promise');



//new game state
exports.newGameState = function (game) {
    
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

        collection.save(game, function (err, records) {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(record);
            resolve(records[0]);

        });
    });

    return promise;
};


exports.getCurrentGameState = function (gameId) {

    var promise = new Promise(function (resolve, reject) {
        var db = dbConnection.getDbConnection();
        if (!db) {
            console.error("Failed to initialize the db.");
            reject("Failed to initialize the db.");
        }
        var collection = db.collection('games');

        collection.findOne({"_id": gameId}, function (err, record) {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(record);
            resolve(record);

        });
    });

    return promise;
};

exports.doesTheCurrentGameStateHasTheQuestion = function (gameId, term_id) {

    var promise = new Promise(function (resolve, reject) {
        var db = dbConnection.getDbConnection();
        if (!db) {
            console.error("Failed to initialize the db.");
            reject("Failed to initialize the db.");
        }
        var collection = db.collection('games');

        collection.findOne({"_id": gameId, "set.terms.id": term_id}, function (err, record) {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(record);
            resolve(record);

        });
    });

    return promise;
};




exports.gameMove = function (playerAnswer , io) {

    var gameState = gamestate.doesTheCurrentGameStateHasTheQuestion(playerAnswer.game_id, playerAnswer.term_id);
    var gameResponse = new Object();
    gameState.then(function (currentGameState) {
        if (currentGameState) {
            var terms = currentGameState.set.terms;
            for (var i in terms) {
                if (terms[i].id === playerAnswer.term_id) {
                    if (terms[i].definition === playerAnswer.definition) {  //correct answer
                        
                        terms.splice(index, 1);
                        var players = currentGameState.players;
                        for(var j in players){
                            if(players[j].id === playerAnswer.player_id){
                                if(!players[j].score)
                                    players[j].score = 0;
                                players[j].score = 1+ players[j].score ;
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
                                    gameResponse.player = {"id" :players[j].id , "score" : players[j].score } ;
                                    console.log(gameResponse);
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
                                    gameResponse.player = {"id" :players[j].id , "score" : players[j].score } ;
                                    gameResponse.alreadyAnswered = false;
                                    console.log(gameResponse);
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
        console.log("question already answered");
        return null;
    });



};


