const credentials = {
    host: "localhost",
    user: "root",
    password: "root"
}




exports.connect = function(){
    var mysql = require('mysql');
    return new Promise((resolve, reject)=>
        {   
            var con = mysql.createConnection({
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
                resolve(con);
            });  

        }
    )
    
}