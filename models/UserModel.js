const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String
})

const UserModel = mongoose.model("user", UserSchema)
module.exports = UserModel