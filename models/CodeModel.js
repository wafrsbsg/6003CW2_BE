const mongoose = require('mongoose')

const CodeSchema = new mongoose.Schema({
  registerCode: String
})

const CodeModel = mongoose.model("codes", CodeSchema)
module.exports = CodeModel