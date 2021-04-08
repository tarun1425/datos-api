const db = require('../models/db');

module.exports.getAL = (req, res, next) => {

    console.log(req.body.companies.length);
    console.log(req.body);

    allVal = [];

    function companyConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;        

        if (typeof params.companies != 'undefined') {
            for (const company of params.companies) {
                conditions.push("company.company_name = ?");
                values.push(company);
                allVal.push(company);
            }
        }
        return {
            where: conditions.length ?
                '('.concat(conditions.join(' or ')).concat(')') : '1',
            values: values
        };
    }

    function companyDomainConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;
        
        if (typeof params.companies != 'undefined') {
            for (const company of params.companies) {
                conditions.push("company.website = ?");
                values.push(company);
                allVal.push(company);
            }
        }
        return {
            where: conditions.length ?
                '('.concat(conditions.join(' or ')).concat(')') : '1',
            values: values
        };
    }

    function leftTenCompaniesConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;
        
        if (typeof params.companies != 'undefined') {
            for (const company of params.companies) {
                conditions.push("left(trim(company.company_name), 10) = left(trim(?), 10)");
                values.push(company);
                allVal.push(company);
            }
        }
        return {
            where: conditions.length ?
                '('.concat(conditions.join(' or ')).concat(')') : '1',
            values: values
        };
    }

    function keyCompaniesConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;

        if (typeof params.companies != 'undefined') {
            for (const company of params.companies) {
                conditions.push("company.company_name like ?");
                values.push('%'+company+'%');
                allVal.push('%'+company+'%');
            }
        }
        return {
            where: conditions.length ?
                '('.concat(conditions.join(' or ')).concat(')') : '1',
            values: values
        };
    }

    // var companyListCheck = companyConditions(req.body);
    // var companyDomainCheck = companyDomainConditions(req.body);
    // var companyLeftCheck = leftTenCompaniesConditions(req.body);
    // var companyKeyCheck = keyCompaniesConditions(req.body);


    switch (req.body.match) {
        case 'domain':
            var companyDomainCheck = companyDomainConditions(req.body);
            sql = 'select contact.update_date,first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_status,qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyDomainCheck.where;
            break;
        
        case 'full':
            var companyListCheck = companyConditions(req.body);
            sql = 'select contact.update_date,first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_status,qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyListCheck.where;
            break;
        
        case 'left':
            var companyLeftCheck = leftTenCompaniesConditions(req.body);
            sql = 'select contact.update_date,first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_status,qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyLeftCheck.where;
            break;
        
        case 'key':
            var companyKeyCheck = keyCompaniesConditions(req.body);
            sql = 'select contact.update_date,first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_status,qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyKeyCheck.where;
            break;
    
        default:
            sql = "select 'Default Block Calling !!! please Contact with Tarun'"
            break;
    }

    // sql = 'select count(contact.id) as count from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyListCheck.where;

    db.query(sql, allVal ,(err, rows, fields) => {
        if (err) throw err;
        else res.send(rows);
    });
}




module.exports.getCountAL = (req, res, next) => {

    console.log(req.body.companies.length);

    allVal = [];

    function companyConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;        

        if (typeof params.companies != 'undefined') {
            for (const company of params.companies) {
                conditions.push("company.company_name = ?");
                values.push(company);
                allVal.push(company);
            }
        }
        return {
            where: conditions.length ?
                '('.concat(conditions.join(' or ')).concat(')') : '1',
            values: values
        };
    }

    function companyDomainConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;
        
        if (typeof params.companies != 'undefined') {
            for (const company of params.companies) {
                conditions.push("company.website = ?");
                values.push(company);
                allVal.push(company);
            }
        }
        return {
            where: conditions.length ?
                '('.concat(conditions.join(' or ')).concat(')') : '1',
            values: values
        };
    }

    function leftTenCompaniesConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;
        
        if (typeof params.companies != 'undefined') {
            for (const company of params.companies) {
                conditions.push("left(trim(company.company_name), 10) = left(trim(?), 10)");
                values.push(company);
                allVal.push(company);
            }
        }
        return {
            where: conditions.length ?
                '('.concat(conditions.join(' or ')).concat(')') : '1',
            values: values
        };
    }

    function keyCompaniesConditions(params) {
        var conditions = [];
        var values = [];
        var conditionsStr;

        if (typeof params.companies != 'undefined') {
            for (const company of params.companies) {
                conditions.push("company.company_name like ?");
                values.push('%'+company+'%');
                allVal.push('%'+company+'%');
            }
        }
        return {
            where: conditions.length ?
                '('.concat(conditions.join(' or ')).concat(')') : '1',
            values: values
        };
    }

    // var companyListCheck = companyConditions(req.body);
    // var companyDomainCheck = companyDomainConditions(req.body);
    // var companyLeftCheck = leftTenCompaniesConditions(req.body);
    // var companyKeyCheck = keyCompaniesConditions(req.body);


    switch (req.body.match) {
        case 'domain':
            var companyDomainCheck = companyDomainConditions(req.body);
            sql = 'select count(contact.id) as count from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyDomainCheck.where;
            break;
        
        case 'full':
            var companyListCheck = companyConditions(req.body);
            sql = 'select count(contact.id) as count from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyListCheck.where;
            break;
        
        case 'left':
            var companyLeftCheck = leftTenCompaniesConditions(req.body);
            sql = 'select count(contact.id) as count from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyLeftCheck.where;
            break;
        
        case 'key':
            var companyKeyCheck = keyCompaniesConditions(req.body);
            sql = 'select count(contact.id) as count from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyKeyCheck.where;
            break;
    
        default:
            sql = "select 'Default Block Calling !!! please Contact with Tarun'"
            break;
    }

    // sql = 'select count(contact.id) as count from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyListCheck.where;

    db.query(sql, allVal ,(err, rows, fields) => {
        if (err) throw err;
        else res.send(rows);
    });
}



    // sql = 'select contact.update_date,first_name, last_name, job_title ,company_name, website, email_address,contact.work_phone, contact.address_l1, contact.city, contact.State, contact.Zip_code, contact.Country, emp_range, LI_industry, vv_disposition, qa_status,qa_reason, LI_link, LI_company_link from contact inner join company on contact.c_id = company.id inner join email on email.contact_id = contact.id inner join quality_check on quality_check.contact_id = contact.id WHERE ' + companyListCheck.where;
