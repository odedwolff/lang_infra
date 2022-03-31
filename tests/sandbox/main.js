//db = require('./tests/sandbox/db.js');
db = require('./db.js');
lineReader = require('./readLines.js');


db.connect().then((func)=>{lineReader.go(func)});
