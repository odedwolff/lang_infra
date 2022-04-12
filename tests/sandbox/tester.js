
pproc = require('./preprocess.js');
 


function testIsWors(){
    const wordCandidates = ["a", "word", "d'accrodo", "45", "", undefined];
    var candidate; 
    var isWord;
    for (var i  = 0 ; i < wordCandidates.length ; i++){
        candidate = wordCandidates[i];
        isWord = pproc.expIsWord(candidate)
        console.log(`${candidate} is ${isWord ?"":"not"} a word`);
    }
    
}


/**
 * {k1:v1, k2:v2} => []
 * 
 */
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

//testIsWors();
testConvert();