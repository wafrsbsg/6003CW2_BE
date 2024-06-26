const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()
const cors = require('cors')
const UserModel = require('./models/UserModel')
const StaffModel = require('./models/StaffModel')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const CatModel = require('./models/CatModel')
const multer = require('multer')
const LikeModel = require('./models/LikeModel')
const path = require('path')
const MessageModel = require('./models/MessageModel')
const CodeModel = require('./models/CodeModel')

  
const app = express()
const secret = "123"



app.use(express.json())
//app.use(cors({credentials:true,origin:'https://e1e039f4-bb5f-41f0-9f76-11b6aad2aba6-00-2684sxvwh9ivg.kirk.replit.dev'}))
app.use(cookieParser())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://e1e039f4-bb5f-41f0-9f76-11b6aad2aba6-00-2684sxvwh9ivg.kirk.replit.dev');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('public'))



//connect mongo database123
mongoose.connect("mongodb+srv://123:123@6003.tdqfq6v.mongodb.net/6003?retryWrites=true&w=majority")
  .then(console.log("Connected"))
  .catch(err=>console.log(err))

//register, use salt to hash
app.post('/register', async (req,res) => {
  const {email,password,name} = req.body
  try{
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hashSync(req.body.password, salt)
const emailTaken = await UserModel.findOne({ email })
    if (emailTaken) {
      return res.status(400).json({ err: 'email has been used' })
    } else{
    const userM = await UserModel.create({
      email,
      name,
      password:hashedPass,
    })
    res.json(userM)
    }
  } catch(e) {
    console.log(e)
    console.log(password)
    res.json(e)
  }
})

//login, save cookie
app.post('/login', async (req,res) => {
  const {email,password} = req.body
  const userM = await UserModel.findOne({email})
    if (!userM) {


      return res.status(400).json({ err: 'email is worng' })
    } else{
const checkPass = bcrypt.compareSync(password, userM.password)

  if (checkPass) {
    // logged in
    jwt.sign({email,id:userM._id}, secret, {}, (err,token) => {
      if (err) throw err
      res.cookie('token', token).json({
        id:userM._id,
        email,
      })
    })
  } else {
    res.status(400).json('email or password is worng')
  }
    }

})

//staff register, use salt to hash
app.post('/staffRegister', async (req,res) => {
  const {email,password,name,registerCode} = req.body
const codeM = await CodeModel.findOne({registerCode})

if(!codeM){
return res.status(400).json({ err: 'code is worng' })
} else if (registerCode == codeM.registerCode) {

  try{
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hashSync(req.body.password, salt)
    const emailTaken = await StaffModel.findOne({ email })
    if (emailTaken) {
      return res.status(400).json({ err: 'email has been used' })
    } else{
    const staffM = await StaffModel.create({
      email,
      name,
      password:hashedPass,
    })
    res.json(staffM)
    }
  } catch(e) {
    console.log(e)
    console.log(password)
    res.json(e)
  }
}

})

//staff login, save cookie
app.post('/staffLogin', async (req,res) => {
  const {email,password} = req.body
  const staffM = await StaffModel.findOne({email})

if(!staffM){
return res.status(400).json({ err: 'email is worng' })
    } else{
  const checkPass = bcrypt.compareSync(password, staffM.password)
  if (checkPass) {
    jwt.sign({email,id:staffM._id}, secret, {}, (err,token) => {
      if (err) throw err
      res.cookie('token', token).json({
        id:staffM._id,
        email,
      })
    })
  } else {
    res.status(400).json('email or password is worng')
  }
}

})

//check login(cookie)
app.get('/data', (req,res) =>{
   const {token} = req.cookies
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err
    res.json(info)
  })
})

//logout by clear token
app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok')
})

//get cat
app.get('/showCat', async (req,res) =>{
   const cat = await CatModel.find()
  res.send(cat)
})

//use multer for upload, and define the storage location and file name of uploaded images
const storage = multer.diskStorage({
  destination: (req, imageurl, cb) => {
    cb(null,'public/images')
  },
  filename:(req, imageurl, cb) => {
  //console.log(file)
  cb(null, imageurl.fieldname + "_" + Date.now() + path.extname(imageurl.originalname))
  }
})
const upload = multer({storage:storage})

//save cat(for staff), get catName and describe as parameters, and get file as request. Then upload image to server and insert data to database
app.post('/saveCat:catName/:describe',upload.single('file'), async (req,res) => {
  console.log(req.file)
  console.log(req.file.filename)
  console.log(req.params.catName)
  console.log(req.params.describe)
  //const {catName,describe,imageurl} = req.body
  //console.log(req.body.imageurl)
  //console.log(req.body.catName)
  try{
    const catM = await CatModel.create({
      catName: req.params.catName,
      describe: req.params.describe,
      imageurl: req.file.filename,
    })
    console.log(catM)
    res.json(catM)
  } catch(e) {
    console.log(e)
    res.json(e)
  }
})

app.post('/upload',upload.single('file'), async (req, res) => {
  console.log(req.file)
})

//delete cat by id(for staff)
app.delete('/deleteCat/:id', async (req, res) => {
  console.log(req.params.id)
  CatModel.deleteOne({_id:req.params.id})
    .then(() => res.send("success"))
    .catch((err) => {
      console.log(err)
      res.send({ error: err, msg: "wrong" })
    })
})

//update cat by id(for staff), upload new image like save cat
app.put('/updateCat/:id/:catName/:describe',upload.single('file'), async (req, res) => {
  const{catName,describe,imageurl} = req.body
  console.log(req.params.id)
try{
    const catM = await CatModel.updateOne({_id:req.params.id},{catName:req.params.catName,describe:req.params.describe,imageurl: req.file.filename})
    res.json(catM)
  } catch(e) {
    console.log(e)
    res.json(e)
  }
})

//like cat(for public)
app.post('/likeCat', async (req,res) => {
  const {userEmail,catName,describe,imageurl} = req.body
  try{
const catTaken = await LikeModel.find({ userEmail })
    if (catTaken.catName == catName) {
      return res.status(400).json({ err: 'cat has been liked' })
    } else{

    const likeM = await LikeModel.create({
      userEmail,
      catName,
      describe,
      imageurl,
    })
    res.json(likeM)
    }

  } catch(e) {
    console.log(e)
    res.json(e)
  }
})



//get like cat based on current user email(for public)
app.all('/showLikeCat/:userEmail', async (req,res) =>{
  const {userEmail} = req.params
  const like = await LikeModel.find({userEmail})
  console.log({userEmail})
  res.send(like)
  console.log(like)
})

//delete like cat(for public)
app.delete('/deleteLikeCat/:id', async (req, res) => {
  console.log(req.params.id)
  LikeModel.deleteOne({_id:req.params.id})
    .then(() => res.send("success"))
    .catch((err) => {
      console.log(err)
      res.send({ error: err, msg: "wrong" })
    })
})

//send message
app.post('/sendMessage', async (req,res) => {
  const {senderEmail,message} = req.body
  try{
    const MessageM = await MessageModel.create({
      senderEmail,
      message,
      saveEmail:req.body.senderEmail,
    })
    res.json(MessageM)
  } catch(e) {
    console.log(e)
    res.json(e)
  }
})

//get message based on current user email(for public)
app.get('/showMessage/:saveEmail', async (req,res) =>{
  const {saveEmail} = req.params
  const MessageM = await MessageModel.find({saveEmail})
  console.log({saveEmail})
  res.send(MessageM)
  console.log(MessageM)
})

//get all message(for staff)
app.get('/showMessageS', async (req,res) =>{
   const MessageM = await MessageModel.find()
  res.send(MessageM)
})

//send message(for staff)
app.post('/sendMessageS', async (req,res) => {
  const {senderEmail,message,saveEmail} = req.body
  try{
    const MessageM = await MessageModel.create({
      senderEmail,
      message,
      saveEmail,
    })
    res.json(MessageM)
  } catch(e) {
    console.log(e)
    res.json(e)
  }
})

//delete message by id(for staff)
app.delete('/deleteMessage/:id', async (req, res) => {
  console.log(req.params.id)
  MessageModel.deleteOne({_id:req.params.id})
    .then(() => res.send("success"))
    .catch((err) => {
      console.log(err)
      res.send({ error: err, msg: "wrong" })
    })
})


app.listen(5000, ()=> {
    console.log("Running")
})