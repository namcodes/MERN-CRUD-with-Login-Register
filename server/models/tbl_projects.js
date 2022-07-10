const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tbl_projects = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("tbl_projects", tbl_projects);
