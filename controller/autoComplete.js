const db = require('../models/db');

module.exports.getFunction = (req, res, next) =>{
    sql = `select DISTINCT job_function from contact order by job_function`;
    db.query(sql, (err, rows, fields) =>{
        if (err) {
            throw err;
        } else {
            console.log('job function : ', rows);
            res.send(rows);
        }
    });
}

module.exports.getJobLevel = (req, res, next) =>{
    sql = `select DISTINCT job_level from contact order by job_level`;
    db.query(sql, (err, rows, fields) =>{
        if (err) {
            throw err;
        } else {
            console.log('job Level : ', rows);
            res.send(rows);
        }
    });
}

module.exports.getFunction = (req, res, next) =>{
    sql = `select DISTINCT job_function from contact order by job_function`;
    db.query(sql, (err, rows, fields) =>{
        if (err) {
            throw err;
        } else {
            console.log('job function : ', rows);
            res.send(rows);
        }
    });
}

module.exports.getIndustry = (req, res, next) =>{
    sql = 'select DISTINCT LI_industry from company where LI_industry like ? order by LI_industry';
    db.query(sql, ['%'+req.body.ind+'%'], (err, rows, fields) => {
      if (err) throw err;
      res.status(200).send(rows);
    });
  }

