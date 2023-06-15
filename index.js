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
  
const app = express()
const secret = "123"

app.use(express.json())
app.use(cors({credentials:true,origin:'https://6003fe.darwelldavid.repl.co'}))
app.use(cookieParser())



//connect mongo database123
mongoose.connect("mongodb+srv://123:123@6003.tdqfq6v.mongodb.net/6003?retryWrites=true&w=majority")
  .then(console.log("Connected"))
  .catch(err=>console.log(err))

//register, use salt to hash
app.post('/register', async (req,res) => {
  const {email,password,name} = req.body;
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hashSync(req.body.password, salt);
    const userM = await UserModel.create({
      email,
      name,
      password:hashedPass,
    });
    res.json(userM);
  } catch(e) {
    console.log(e);
    console.log(password);
    res.json(e);
  }
});

//login, save cookie
app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userM = await UserModel.findOne({email});
  const checkPass = bcrypt.compareSync(password, userM.password);
  if (checkPass) {
    // logged in
    jwt.sign({email,id:userM._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userM._id,
        email,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

//staff egister, use salt to hash
app.post('/staffRegister', async (req,res) => {
  const {email,password,name} = req.body;
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hashSync(req.body.password, salt);
    const staffM = await StaffModel.create({
      email,
      name,
      password:hashedPass,
    });
    res.json(staffM);
  } catch(e) {
    console.log(e);
    console.log(password);
    res.json(e);
  }
});

//staff login, save cookie
app.post('/staffLogin', async (req,res) => {
  const {email,password} = req.body;
  const staffM = await StaffModel.findOne({email});
  const checkPass = bcrypt.compareSync(password, staffM.password);
  if (checkPass) {
    // logged in
    jwt.sign({email,id:staffM._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:staffM._id,
        email,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

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
});

//get cat
app.get('/showCat', async (req,res) =>{
   const cat = await CatModel.find()
  res.send(cat)
})

//save cat(for staff)
app.post('/saveCat', async (req,res) => {
  const {catName,describe,imageurl} = req.body;
  try{
    const catM = await CatModel.create({
      catName,
      describe,
      imageurl,
    });
    res.json(catM);
  } catch(e) {
    console.log(e);
    res.json(e);
  }
});

//delete cat(for staff)
app.delete('/deleteCat/:id', async (req, res) => {
  console.log(req.params.id)
  CatModel.deleteOne({_id:req.params.id})
    .then(() => res.send("success"))
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "wrong" });
    })
})




app.listen(5000, ()=> {
    console.log("Running");
})