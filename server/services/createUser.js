const tbl_accounts = require('../models/tbl_accounts');

module.exports = async (fname, lname, email, password) =>{
    try {
        await tbl_accounts.insertMany({
            fname,
            lname,
            email,
            password
        })
        return true;
    } catch (error) {
        return false;
    }
}