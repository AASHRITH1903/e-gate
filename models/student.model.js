const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  username: String,
  bloodgroup: String,
  phonenumber: String,
  password: String,
  email: String,
  gender: String
})

module.exports = mongoose.model('Student', StudentSchema);
