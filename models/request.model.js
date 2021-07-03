const mongoose = require("mongoose")
const Schema = mongoose.Schema

const RequestSchema = new Schema({
    name: String,
    roll: String,
    location: String,
    reason: String,
    phno: String,
    req_status: String,
    outing_status: String,
})

module.exports = mongoose.model('Request', RequestSchema)