//db = require('./tests/sandbox/db.js');
db = require('./db.js');

db.connect().then((con)=>{console.log(`here i am. rock you like a ${con}}`)});
