const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = express();

mongoose.connect("mongodb+srv://zulul:TyA3dm8a94XADnUX@cluster0.wpsie.mongodb.net/coronarchive?retryWrites=true&w=majority")
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


module.exports = app;