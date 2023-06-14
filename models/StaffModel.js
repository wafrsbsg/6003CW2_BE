const mongoose = require('mongoose')

const StaffSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String
})

const StaffModel = mongoose.model("staff", StaffSchema)
module.exports = StaffModel