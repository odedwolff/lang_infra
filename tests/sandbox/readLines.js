
//db = require('./db.js');

const readline = require('readline');
const fs = require('fs');
const lineReader = require('line-reader');



const PATH = "C:/projects/software/data/languages/italain/sorted.it.word.unigrams.txt";
const LINES_LIMIT = 20;
var linesCounter = 0;  



exports.go = function() {
    lineReader.eachLine(PATH, function (line) {
        processLine(line);
        //console.log(line);
        linesCounter++;
        if (linesCounter > LINES_LIMIT) {
            return false;
        }
    });
}


function processLine(line){
    var split = line.split(/\s+|\t+/);
    console.log(`length: ${split.length}  arr:${split}  ` );
}


exports.go2 = (db) => {
    console.log(db);
}

exports.go3 = (func) =>{
    func('word23', 567, 'trx23');
}


//module.exports.go();
