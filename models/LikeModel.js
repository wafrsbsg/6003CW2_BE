const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema({
  userEmail: String,
  catName: String,
  describe: String,
  imageurl: String
})

const LikeModel = mongoose.model("like", LikeSchema)
module.exports = LikeModel