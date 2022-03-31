
//db = require('./db.js');

const readline = require('readline');
const fs = require('fs');
const lineReader = require('line-reader');
const trx = require('./trx_client_callback.js');
db = require('./db.js');


//const PATH = "C:/projects/software/data/languages/italain/sorted.it.word.unigrams.txt";
const PATH =  "C:/projects/software/data/languages/italain/words.it.raw.test.txt";
const LINES_LIMIT = 20;
var linesCounter = 0;  



exports.go = function(con) {
    lineReader.eachLine(PATH, function (line) {
        processLine(line, con);
        //console.log(line);
        linesCounter++;
        if (linesCounter > LINES_LIMIT) {
            return false;
        }
    });
}


function processLine(line, con){
    var split = line.split(/\s+|\t+/);
    
    //console.log(`length: ${split.length}  arr:${split}  ` );
    //console.log(`mock sending to translate word ${split[1]}`);
    const count = split[0];
    const word = split[1];
    console.log(`source word:${word}`);
    trx.translateText2(word, 'it', 'en').
        then((res)=>{
            console.log(`${word} -> ${res}`);
            db.saveLine(con, word, count, res);
        });
}


exports.go2 = (db) => {
    console.log(db);
}

exports.go3 = (func) =>{
    func('word23', 567, 'trx23');
}


//module.exports.go();
