const express = require("express");
const app = express();
const { urlencoded, json } = require("body-parser");
const mongoose = require("mongoose");
// const UserModel = require("../models/UserModel");
const passport = require("passport");
const session = require("express-session");
const ConversationModel  = require('./models/conversation')
const MessageModel = require('./models/Message')
const cors = require('cors')
const localStrategy = require("passport-local").Strategy;


app.use(cors())

mongoose
  .connect("mongodb://127.0.0.1:27017/InceptAI")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("There is an error in connecting to DB", err);
  });


//Scehme of the 
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema({
    username:{
        Type: String,
        // required : true
    },
    email:{
        Type: String,
        // required: true,
        // unique : true
    },
    password : {
        Type : String,
        // required : true
    }
})

UserSchema.plugin(passportLocalMongoose)

const UserModel = mongoose.model('UserModel',UserSchema)

//uptill here schema

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const add = (a,b) =>{
  return a+b
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.use(express.urlencoded({ extended: true }));
app.use(json());
app.use(
  session({
    secret: "This is the secret to sign",
    resave: false,
    saveUninitialized: false,
  })
);

passport.use(new localStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// app.use((req,res,next)=>{

// })

app.get("/", (req, res) => {
  res.send("This is the home page");
  console.log('The current user is ',req.user)
});

app.post("/register", (req, res) => {
  console.log('We are in the registering route')
  const { username, email, password } = req.body;
  UserModel.register({ username, email }, password)
    .then(() => {
      console.log("Registered to DB");
      res.send("User registered successfully");
    })
    .catch((err) => {
      console.error("Error in registering ", err);
      res.status(500).send("Error in registration");
    });
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/signUp' }), (req, res) => {
  res.redirect('/')
})

app.post('/api/conversation',async(req,res)=>{
  const{senderId, recieverId } = req.body;
  const newc  = ConversationModel({conversation : [senderId,recieverId]})
  await newc.save()  
})

app.get('/api/conversation/:userId', async (req, res) => {
  console.log('Hey! we are in the correct route');
  const { userId } = req.params;
  console.log('The id of the object is ', userId);
  try {
    const conversations = await ConversationModel.find({ members: { $in: [userId] } });

    const conversationData = await Promise.all(
      conversations.map(async (conversion) => {
        const recieverId = conversion.members.find((member) => member !== userId);
        try {
          const user = await UserModel.findById(recieverId);
          console.log('we found the user', user);
          return { conversation: conversion, user: user };
        } catch (err) {
          console.log('We cannot find the user due to', err);
          return { conversation: conversion, user: null };
        }
      })
    );

    console.log('we found the specific user reference in all other conversation', conversationData);
    res.json(conversationData);
  } catch (error) {
    console.log('Error fetching conversations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/message',async(req,res)=>{
  const {conversationId,senderId,Message} = req.body;
  const newM =new MessageModel({conversationId,senderId,Message})
  await MessageModel.save();
  res.send('The message is saved to DB',newM)
})

app.get('/api/message/:conversationId',async(req,res)=>{
    const conversationId = req.params.conversationId
    const messages = await MessageModel.findById(conversationId)
    console.log('We found the message with the respective ID')
    res.send('Message:',messages)
})

app.get('/api/users',async(req,res)=>{
   try{
    const Users = await find.UserModel({})
    res.send('We got all the users',Users)
   }catch(err){
    console.log('There is an error in here',err)
   }
})

console.group('I am fucked up , worked for three consecutive fucking hrs ')

app.listen(3003, () => {
  console.log("The server is listening at the specified port");
});
