
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




testIsWors();