const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'threetecdatabase.c8oixrackqoj.us-east-2.rds.amazonaws.com',
    user: 'tarun',
    password: 'tarun1428',
    database: 'quality_data',
});

conn.connect((err)=>{
    if (err)
        console.log(err);
    else
        console.log('database connected');
});


conn.timeout = 0;

module.exports =conn;
