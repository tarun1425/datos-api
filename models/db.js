const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'database-1.cympaetq51mb.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'tarun1234',
    database: 'qa_data',
});

conn.connect((err)=>{
    if (err)
        console.log(err);
    else
        console.log('database connected');
});


conn.timeout = 0;

module.exports =conn;
