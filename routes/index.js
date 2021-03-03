var express = require('express');
var router = express.Router();


const countryCtrl = require('../controller/getCountry');
const autoCompleteCtrl = require('../controller/autoComplete');
const dataCountCtrl = require('../controller/dataCount');

var db = require('../models/db');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/filterData', (req, res, next) => {

  console.log('This is data : ', req.body);

  var allVal = [];

  function buildConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;


    if (typeof params.industry != 'undefined') {
      conditions.push("LI_industry LIKE ?");
      values.push("%" + params.industry + "%");
    }

    if (typeof params.title != 'undefined') {
      conditions.push("job_title LIKE ?");
      values.push("%" + params.title + "%");
    }

    if (typeof params.employeeSize != 'undefined') {
      conditions.push("emp_range LIKE ?");
      values.push("%" + params.employeeSize + "%");
    }

    if (typeof params.naicsCode != 'undefined') {
      conditions.push("naics_code LIKE ?");
      values.push("%" + params.naicsCode + "%");
    }

    if (typeof params.sicCode != 'undefined') {
      conditions.push("sic_code LIKE ?");
      values.push("%" + params.sicCode + "%");
    }

    return {
      where: conditions.length ?
        conditions.join(' and ') : '1',
      values: values
    };
  }

  // for country
  function countryConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    for (const country of params.countries) {
      if (typeof params.countries != 'undefined') {
        conditions.push("contact.Country LIKE ?");
        values.push("%" + country + "%");
        allVal.push("%" + country + "%");
      }
    }

    return {
      where: conditions.length ?
        '('.concat(conditions.join(' or ')).concat(')') : '1',
      values: values
    };
  }

  // for industry
  function industryConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    // for (const industry of params.industry) {
    //   if (typeof params.country != 'undefined') {
    //       conditions.push("LI_industry LIKE ?");
    //       values.push("%" + industry + "%");
    //       allVal.push("%" + industry + "%");
    //   }
    // }

    if (typeof params.industries != 'undefined') {
      for (const industry of params.industries) {
        conditions.push("LI_industry LIKE ?");
        values.push("%" + industry + "%");
        allVal.push("%" + industry + "%");
      }
    }

    return {
      where: conditions.length ?
        '('.concat(conditions.join(' or ')).concat(')') : '1',
      values: values
    };
  }

  // for Employee range
  function employeeRangeConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    // for (const empRange of params.employeeSize) {
    //   if (typeof params.employeeSize != 'undefined') {
    //       conditions.push("emp_range LIKE ?");
    //       values.push("%" + empRange + "%");
    //       allVal.push("%" + empRange + "%");
    //   }
    // }

    if (typeof params.employeeSize != 'undefined') {
      for (const empRange of params.employeeSize) {
        conditions.push("emp_range LIKE ?");
        values.push("%" + empRange + "%");
        allVal.push("%" + empRange + "%");
      }
    }

    return {
      where: conditions.length ?
        '('.concat(conditions.join(' or ')).concat(')') : '1',
      values: values
    };
  }


  // for job title
  function jobTitleConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    if (typeof params.title != 'undefined') {
    for (const title of params.title) {
        conditions.push("job_title LIKE ?");
        values.push("%" + title + "%");
        allVal.push("%" + title + "%");
      }
    }

    return {
      where: conditions.length ?
        '('.concat(conditions.join(' or ')).concat(')') : '1',
      values: values
    };
  }

  // for job_level
  function jobLevelConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    if (typeof params.jobLevel != 'undefined') {
    for (const jobLevel of params.jobLevel) {
        conditions.push("job_level LIKE ?");
        values.push("%" + jobLevel + "%");
        allVal.push("%" + jobLevel + "%");
      }
    }

    return {
      where: conditions.length ?
        '('.concat(conditions.join(' or ')).concat(')') : '1',
      values: values
    };
  }

  // for job function
  function jobFunctionConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    if (typeof params.jobFunction != 'undefined') {
    for (const jobFunction of params.jobFunction) {
        conditions.push("job_function LIKE ?");
        values.push("%" + jobFunction + "%");
        allVal.push("%" + jobFunction + "%");
      }
    }

    return {
      where: conditions.length ?
        '('.concat(conditions.join(' or ')).concat(')') : '1',
      values: values
    };
  }

  function deadConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    if (typeof params.dead != 'undefined') {
        conditions.push("qa_reason not REGEXP ?");
        values.push(params.dead + "+");
        allVal.push(params.dead + "+");
    }

    return {
      where: conditions.length ?
        '('.concat(conditions.join(' or ')).concat(')') : '1',
      values: values
    };
  }


  var conditions = buildConditions(req.body);
  var countryChack = countryConditions(req.body);
  var industryCheck = industryConditions(req.body);
  var empCheck = employeeRangeConditions(req.body);
  var jobTitleCheck = jobTitleConditions(req.body);
  var jobLevelCheck = jobLevelConditions(req.body);
  var jobFunctionCheck = jobFunctionConditions(req.body);
  var deadCheck = deadConditions(req.body);

  console.log(industryCheck.length);

  console.log('//////////////////////where condition/////////////////////////////' + countryChack.where + 'and' + industryCheck.where + '///////////////////////////////////////' + countryChack.where.length);

  if (req.body.dead) {
    console.log('dead prospect also showing');
    sql = 'select contact.update_date,first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_status,qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + countryChack.where + ' and ' + industryCheck.where + ' and ' + empCheck.where + ' and ' + jobTitleCheck.where + ' and ' + jobLevelCheck.where + ' and ' + jobFunctionCheck.where + ` Limit ${req.body.limit}`;
  } else {
    console.log('dead prospect dose not showing');
    sql = 'select contact.update_date,first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_status,qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + countryChack.where + ' and ' + industryCheck.where + ' and ' + empCheck.where + ' and ' + jobTitleCheck.where + ' and ' + jobLevelCheck.where + ' and ' + jobFunctionCheck.where + ' and ' + deadCheck.where +` Limit ${req.body.limit}`;
  }
  // sql = 'select contact.update_date,first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_status,qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + countryChack.where + ' and ' + industryCheck.where + ' and ' + empCheck.where + ' and ' + jobTitleCheck.where + ' and ' + jobLevelCheck.where + ' and ' + jobFunctionCheck.where + ` Limit ${req.body.limit}`;

  console.log(sql);

  console.log(allVal);
  db.query(sql, allVal, (err, rows, fields) => {
    if (err) throw err;
    res.status(200).send(rows);
  });
});




// get employee range
router.get('/employeeSize', (req, res, next) => {
  sql = `SELECT DISTINCT emp_range FROM company order by emp_range`;
  db.query(sql, (err, rows, fields) => {
    if (err) throw err;
    res.status(200).send(rows);
  });
});



// get count
router.post('/getCount1', (req, res, next) => {
  function buildConditions(params) {
    var conditions = [];
    var values = [];
    var conditionsStr;

    if (typeof params.country != 'undefined') {
      conditions.push("contact.Country LIKE ?");
      values.push("%" + params.country + "%");
    }

    if (typeof params.industry != 'undefined') {
      conditions.push("LI_industry LIKE ?");
      values.push("%" + params.industry + "%");
    }

    if (typeof params.title != 'undefined') {
      conditions.push("job_title LIKE ?");
      values.push("%" + params.title + "%");
    }

    if (typeof params.employeeSize != 'undefined') {
      conditions.push("emp_range LIKE ?");
      values.push("%" + params.employeeSize + "%");
    }

    if (typeof params.naicsCode != 'undefined') {
      conditions.push("naics_code LIKE ?");
      values.push("%" + params.naicsCode + "%");
    }

    if (typeof params.sicCode != 'undefined') {
      conditions.push("sic_code LIKE ?");
      values.push("%" + params.sicCode + "%");
    }

    return {
      where: conditions.length ?
        conditions.join(' AND ') : '1',
      values: values
    };
  }

  var conditions = buildConditions(req.body);
  sql = 'select count(*) from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + conditions.where;
  db.query(sql, conditions.values, (err, rows, fields) => {
    if (err) throw err;
    res.status(200).send(rows);
  });
});



// get country
router.get('/getcountry', countryCtrl.getC);

// get job function
router.get('/getJobFunction', autoCompleteCtrl.getFunction);

// get industry
router.post('/getIndustry', autoCompleteCtrl.getIndustry);

// get job level
router.get('/getJobLevel', autoCompleteCtrl.getJobLevel);

// get count 
router.post('/getCount', dataCountCtrl.getCount);


/**
 var net = require("net");
 net.createServer(function (socket) {
   // no nothing
   
 }).listen(21, function () {
   console.log('Socket ON')
 });
 */

 router.get('/apiTest', (req, res, next) => {
   sql = 'show tables';
   db.query(sql, (err, rows) => {
     if (err) {
       throw err;
     }
     console.log('data :', rows)
     res.send(rows);
   });
 });



net = require("net");

net.createServer((socket) => {
  socket.on("error", (err) => {
    console.log("Caught flash policy server socket error: ")
    console.log(err.stack)
  });
  socket.write("<?xml version=\"1.0\"?>\n");
  socket.write("<!DOCTYPE cross-domain-policy SYSTEM \"http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd\">\n");
  socket.write("<cross-domain-policy>\n");
  socket.write("<allow-access-from domain=\"*\" to-ports=\"*\"/>\n");
  socket.write("</cross-domain-policy>\n");
  socket.end();
}).listen(843, function () {
  console.log('Socket ON')
});

 

module.exports = router;




// sql = 'select first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + countryChack.where+ ' and ' +industryCheck.where + ' and ' + conditions.where + ` Limit ${req.body.limit}`;
