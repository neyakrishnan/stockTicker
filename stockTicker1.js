const MongoClient = require('mongodb').MongoClient;
const csvParser = require("csv-parser");

const readline = require("readline");

// fs module provides a lot of very useful functionality to access and interact with the file system.
const fs = require("fs");

// Node.js provides the path module that allows you to interact with file paths easily.
const path = require("path");

// connection string
const url = "mongodb+srv://Neya_krishnan:LoveISlove1310101*@cluster0.5cbwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// File with which we fill database 
const dataFile = "companies.csv";


function main() 
{
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if(err) { 
        return console.log(err); 
    }
  
    var dbo = db.db("stock_ticker");
	var collection = dbo.collection('companies');
    
    console.log("Success connecting to database)");

    parseCSV(collection, database);

});
}

// functions reads from csv and populates databse
function parseCSV(coll, db) {
    var data = [];
    fs.createReadStream(path.join(__dirname, "",dataFile))
        .on("error", function() {
            console.log("error occured during the reading of this file");
        })
        .pipe(csvParser())
        .on("data", function(row) {
            var newData = newObjectToCollection(row);
            data.push(newData);
        })
        .on("end", function(){
            coll.insertMany(data, (err, res) =>{
                if(err) throw err;
                console.log('Inserted ${res.insertedCount} documents');
                db.close();
            });
        });
}

// Returns an object to be inserted to database with custom key fields.
function newObjectToCollection(rowObj) {
  return { name: rowObj.Company, ticker: rowObj.Ticker };
}

main();
