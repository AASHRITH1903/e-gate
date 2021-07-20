const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: String,
  password: String,
  fullname: String,
  email: String,
  mobile: String,
  address: String
})

module.exports = mongoose.model('Admin', AdminSchema);
