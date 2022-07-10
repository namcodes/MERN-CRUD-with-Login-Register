const tbl_projects = require('../models/tbl_projects');

module.exports = async (user_id, title, description) =>{
    try {
        await tbl_projects.insertMany({
            user_id,
            title,
            description
        })
        return true;
    } catch (error) {
        return false;
    }
}