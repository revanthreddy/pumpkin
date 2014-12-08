var MongoClient = require('mongodb').MongoClient;
var db;
var server = "ec2-54-172-95-254.compute-1.amazonaws.com";

exports.init = function(){
    console.log('Initialising DB ...');
    if(!db){
        MongoClient.connect("mongodb://"+server+":27017/gamestates", function(err, database) {    
            if(err) throw err;
            
            db = database;
            console.log('DB setup complete.');
        });
    }
};

exports.getDbConnection = function(){
    return db;
};