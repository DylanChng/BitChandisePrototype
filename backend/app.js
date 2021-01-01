const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

//DB model
const User = require("./mongdb-models/user")

const app = express();

mongoose.connect("mongodb+srv://zulul:TyA3dm8a94XADnUX@cluster0.wpsie.mongodb.net/bitchandise?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database")
  })
  .catch(() => {
    console.log("Connection failed to database")
  })

app.use(bodyParser.json());

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
})

//Web API here
app.get('/test', (req,res,next) => {
    res.send("test")
    console.log("test");
})

app.post("/login", (req, res, next) => {
  User.findOne({username: req.body.username})
    .then(user =>{ 
      if(!user || user.password !== req.body.password){
        return res.status(401).json({
          message: "Login failed"
        })
      }

      return res.status(200).json({
        message: "Login successful",
        user: user
      })
    })
})

module.exports = app;