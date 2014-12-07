var dbConnection = require('../services/connector');
var Promise = require('promise');



//new game state
exports.newGameState = function (game) {

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




exports.solveQuestion = function (playerAnswer , io) {

    var gameState = gamestate.doesTheCurrentGameStateHasTheQuestion(playerAnswer.game_id, playerAnswer.term_id);

    gameState.then(function (currentGameState) {
        if (currentGameState) {
            var terms = currentGameState.set.terms;
            for (var i in terms) {
                if (terms[i].id === playerAnswer.term_id) {
                    if (terms[i].definition === playerAnswer.definition) {  //correct answer
                        //positive score to player
                        
                            var db = dbConnection.getDbConnection();
                            if (!db) {
                                console.error("Failed to initialize the db.");
                            }
                            var collection = db.collection('games');

                            collection.update({"_id": gameId },
                                              {$pull :{"set.terms" :{"id": playerAnswer.game_id}
                                                  }}, function (err, numRecordsUpdated) {   
                                //db.games.update({_id : 1234} , {$pull :{"set.terms" :{"id": 2005280218}}  } );
                                if (err) {
                                    console.log(err);
                                    
                                }
                                if(numRecordsUpdated > 0)
                                {}
                                else
                                {}
                        });

                    } else { //wrong answer
                        var db = dbConnection.getDbConnection();
                            if (!db) {
                                console.error("Failed to initialize the db.");
                            }
                            var collection = db.collection('games');
                            
                            collection.update({"_id": gameId },
                                              {
                                                  $set : {}
                                              }, function (err, numRecordsUpdated) {   
                                //db.games.update({_id : 1234} , {$pull :{"set.terms" :{"id": 2005280218}}  } );
                                if (err) {
                                    console.log(err);
                                    
                                }
                                if(numRecordsUpdated > 0)
                                {}
                                else
                                {}
                            });
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


