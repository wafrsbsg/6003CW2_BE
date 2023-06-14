const mongoose = require('mongoose')

const CatSchema = new mongoose.Schema({
  catName: String,
  describe: String,
  imageurl: String
})

const CatModel = mongoose.model("cat", CatSchema)
module.exports = CatModel