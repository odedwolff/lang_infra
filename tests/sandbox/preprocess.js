/**
 *   -remove non 
 *   -unite different case instances 
 *   -drop words bellow threshold (very rare)
 */

const lineReader = require('line-reader');
const fs = require('fs');
const readline = require('readline');
const { EOF } = require('dns');




const IN_FILE = "C:/projects/software/data/languages/italain/words.it.raw.test.txt";

const OUT_FILE = "path";

const words = {};

const fakeDict = {};
const fakeInt = 5;




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




function readLines2(){
    var rd = readline.createInterface({
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
        doneReadingLines();
    });

}

function doneReadingLines(){
    console.log(`words= ${JSON.stringify(words)}`);
}




function go(){
    /* processLineByLine();
    console.log(`words=` + words); */
    readLines2();
}

exports.go = function() {
    lineReader.eachLine(IN_FILE, function (line) {
        processLine(line);
    });
}





function isWord(wordCandidate){
    return true;
}

function cleanWord(word){
    console.log(`cleanWord input:${word}`);
    const out = word.replace(/[^0-9a-z]/gi, '');
    console.log(`cleanWord output:${out}`);
    return out;
}


function processLine(line){
    var split = line.split(/\s+|\t+/);
    const count = split[0];
    var word = split[1];
    if(!isWord(word)){
        console.log(`dropped word candidate ${word}`);
        return;
    }
    word = cleanWord(word);
    word = word.toLowerCase();
    if(words[word]){
        words[word]++;
    }else{
        words[word]=1;
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


go();


