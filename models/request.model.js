
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  name: String,
  location: String,
  reason: String,
  req_status: String,
  outing_status: String,
  id: String,
  outtime: String,
  intime: String,
  actual_intime: String
})

module.exports = mongoose.model('Request', RequestSchema);

