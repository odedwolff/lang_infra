//db = require('./tests/sandbox/db.js');
db = require('./db.js');
lineReader = require('./readLines.js');
preprocessor = require('./preprocess.js');


//db.connect().then((func)=>{lineReader.go(func)});


//db.connect2().then((con)=>{lineReader.go(con)});


db.connect2().then((con)=>{preprocessor.go(con)});

