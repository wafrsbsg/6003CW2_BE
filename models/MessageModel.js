const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  senderEmail: String,
  message: String,
  saveEmail: String
})

const MessageModel = mongoose.model("message", MessageSchema)
module.exports = MessageModel