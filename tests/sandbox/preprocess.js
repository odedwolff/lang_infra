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
const { LATIN1_SPANISH_CI, LATIN7_ESTONIAN_CS } = require('mysql/lib/protocol/constants/charsets');





//const IN_FILE = "C:/projects/software/data/languages/italain/words.it.raw.test.txt";
//const IN_FILE = "C:/projects/software/data/languages/italain/1000_records_test.txt";
const IN_FILE = "C:/projects/software/data/languages/italain/sorted.it.word.unigrams.txt";


const OUT_FILE = "path";

const words = {};

const fakeDict = {};
const fakeInt = 5;

const MAX_LINE=30;
var halt = false; 
var linesReadCount = 0;
//file interface  
var rd;
var con; 


const keys =[];
const BATCH_SIZE = 5;
var keysPntr = 0; 
var reqSent = 0;
var nmReqComplete = 0; 
var wordsArr;
var _con; 
var currentBatchBegin = 0;
var lastIdxOfBatch;








function readLines2(){
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
        wordsMapReady();
    });

}



function wordsMapReady(){
    wordsArr = convertDictToList(words);
    processNextBatch();
}

function processNextBatch(){

    lastIdxOfBatch =  currentBatchBegin + BATCH_SIZE - 1;
    while (keysPntr <= lastIdxOfBatch){
        if(keysPntr == wordsArr.length){
            console.log("--INPUT ARRAY CONSUMED--")
            return;
        }
        console.log(`keys pointer = ${keysPntr}, currentBatchBegin = ${currentBatchBegin} last index of batch=${lastIdxOfBatch}`);
        var entry = wordsArr[keysPntr];
        var word;
        var count;
        //if entry empty, skip and count as complete (probably a bug if happens, should be filtered sooner)
        if(entry){
             word = entry[0];
             count = entry[1];
        }else{
            keysPntr++;
            nmReqComplete++;
            console.log("EMPTY ENTRY");
            continue;
        }
        trx.translateText2(word, 'it', 'en')
        //.then((data)=>{console.log(`dont trx---, data=${data}`)})
        .then(((word, count, res)=>{
            console.log(`translated: ${word} -> ${res}`);
            db.saveLine(_con, word, count, res)
            .then(lineSaved);
        }).bind(null, word, count)
        );
        keysPntr++;
    }
    console.log("Batch complete Sending >>>>>\n");
}

function lineSaved(data){
    nmReqComplete++;
    if(nmReqComplete == wordsArr.length){
        console.log("--ALL REQUESTS COMPLETED--");
        _con.end();
        return;
    }
    //const batchTarget = currentBatchBegin + BATCH_SIZE - 1; 
    console.log(`lineSaved, reqComplete=${nmReqComplete}`);
    if(nmReqComplete == lastIdxOfBatch + 1){
        console.log("Batch complete Recieving   <<<<\n\n\n");
        currentBatchBegin += BATCH_SIZE;
        processNextBatch();
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
    _con = con; 
    readLines2();
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




//go();


