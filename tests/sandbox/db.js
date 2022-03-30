const credentials = {
    host: "localhost",
    user: "root",
    password: "root"
}

var con = null;




exports.connect = function(){
    var mysql = require('mysql');
    return new Promise((resolve, reject)=>
        {   
            con = mysql.createConnection({
                host: credentials.host,
                user: credentials.user,
                password: credentials.password
            });
            
            con.connect(function(err) {
                if (err) {
                    console.log("Error on connection!");
                    throw err;
                }
                console.log("Connected!");
                resolve(saveLine.bind(null,con));
            });  
            
        }
    )
    
}

function save(con){
    console.log("saving!")
}

/**con is a connection, assumed to be open */
function saveLine(con, word, instances_cnt, translation){
    var sql = `insert into test_schema_17_oct.words_stats_fake(word, instances_cnt, translation) values('${word}', '${instances_cnt}', '${translation}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
}

exports.save = function(){

}