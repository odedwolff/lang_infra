/**
 *   -remove non 
 *   -unite different case instances 
 *   -drop words bellow threshold (very rare)
 */

const lineReader = require('line-reader');
const fs = require('fs');
const readline = require('readline');
const { EOF } = require('dns');
const trx = require('./trx_client_callback.js');





//const IN_FILE = "C:/projects/software/data/languages/italain/words.it.raw.test.txt";
//const IN_FILE = "C:/projects/software/data/languages/italain/1000_records_test.txt";
const IN_FILE = "C:/projects/software/data/languages/italain/sorted.it.word.unigrams.txt";


const OUT_FILE = "path";

const words = {};

const fakeDict = {};
const fakeInt = 5;

const MAX_LINE=10;
var halt = false; 
var linesReadCount = 0;
//file interface  
var rd;


const keys =[];
const BATCH_SIZE = 5;
var keysPntr = 0; 
var reqSent = 0;
var reqComplete = 0; 
var wordsArr;
var con; 




async function processLineByLine() {
    const fileStream = fs.createReadStream(IN_FILE);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      console.log(`sending line to processing: ${line}`);
      processLine(line);
    }

  }




function readLines2(con){
    rd = readline.createInterface({
        input: fs.createReadStream(IN_FILE),
        output: process.stdout,
        console: false
    });
    
    rd.on('line', function(line) {
        //console.log(line);
        processLine(line);
    }).on('close', function(line) {
        // EOF
        console.log("EOF");
        //doneReadingLines(con);
        wordsMapReady(con);
    });

}

/* 
function doneReadingLines(con){
    //console.log(`words= ${JSON.stringify(words)}`);
    console.log("done reading, next");
    for (var word in words) {
        // check if the property/key is defined in the object itself, not in parent
        if (words.hasOwnProperty(word)) {  
            count =  words[word];        
            console.log(word, count);
            trx.translateText2(word, 'it', 'en').
            then(((word, count, res)=>{
                console.log(`${word} -> ${res}`);
                db.saveLine(con, word, count, res);
            }).bind(null, word, count)
            );
        }
    }
}

 */
function wordsMapReady(con){
    wordsArr = convertDictToList(words);
    processNextBatch(con);
}

function processNextBatch(con){
    if(keysPntr >= wordsArr.length){
        return;
    }
    const lastIdxOfBatch =  keysPntr + BATCH_SIZE;
    while (keysPntr <= lastIdxOfBatch){
        var entry = wordsArr[keysPntr];
        var word;
        var count;
        if(entry){
             word = entry[0];
             count = entry[1];
        }else{
            keysPntr++;
            continue;
        }
        trx.translateText2(word, 'it', 'en')
        .then((data)=>{console.log(`dont trx---, data=${data}`)})
        .then(((word, count, res)=>{
            console.log(`${word} -> ${res}`);
            db.saveLine(con, word, count, res)
            .then(lineSaved);
        }).bind(null, word, count)
        );
        keysPntr++;
    }
    console.log("Batch complete");
}

function lineSaved(data){
    console.log("lineSaved@@@@");
}


function processBatchesREFERENCE(con){
    //console.log(`words= ${JSON.stringify(words)}`);
    console.log("done reading, next");
    for (var word in words) {
        // check if the property/key is defined in the object itself, not in parent
        if (words.hasOwnProperty(word)) {  
            count =  words[word];        
            console.log(word, count);
            trx.translateText2(word, 'it', 'en').
            then(((word, count, res)=>{
                console.log(`${word} -> ${res}`);
                db.saveLine(con, word, count, res);
            }).bind(null, word, count)
            );
        }
    }
}

function convertDictToList(dict) {


    const out = [];
    for (key in dict) {
        out.push([key, dict[key]]);
    }
    return out;
}

function testConvert(){
    const dict = {k1:"v1", k2:"v2", k3:"v3"};
    console.log(dict);
    const arr = convertDictToList(dict);
    console.log(arr);
}





exports.go = function(con){ 
    readLines2(con);
}




function isWord(wordCandidate){
    if ((!wordCandidate) || wordCandidate.length == 0 || !/[a-zA-Z]/.test(wordCandidate[0])){
        return false;
    }
    return true;
}

exports.expIsWord = isWord;


function cleanWord(word){
    //console.log(`cleanWord input:${word}`);
    const out = word.replace(/[^0-9a-z]/gi, '');
    //console.log(`cleanWord output:${out}`);
    return out;
}


function processLine(line){
    linesReadCount++;
    if(linesReadCount > MAX_LINE){
        console.log("max lines processed, terminating input");
        rd.close();
    }
    console.log(`line:${line}`);
    var split = line.split(/\s+|\t+/);
    var count = split[0];
    count = parseInt(count, 10);
    var word = split[1];
    if(!isWord(word)){
        console.log(`dropped word candidate ${word}`);
        return;
    }
    word = cleanWord(word);
    word = word.toLowerCase();
    if(words[word]){
        words[word]+=count;
    }else{
        words[word]=count;
    }

}


function processLineREFERENCE(line, con){
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


//go();


