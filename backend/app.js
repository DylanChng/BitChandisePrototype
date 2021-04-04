const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const { exec } = require("child_process");
const { spawn } = require("child_process");
const path = require('path');

//DB model
const User = require("./mongdb-models/user")
const Node =  require("./mongdb-models/bitnodes")

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

app.get('/test', (req,res,next) => {
    res.status(200).json({
      message: "Connection successful"
    })
})

//Auth API here
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

app.post("/manufacturer/register", (req, res, next) => {    
    const newManufacturer = new User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.manufacturerName,
      userType: "manufacturer"
    })

    newManufacturer.save()
      .then(newManufacturer => {
        return res.status(200).json({
          newManufacturer: newManufacturer,
          message: "New manufacturer successfully created"
        })
      }).catch(err =>{
        console.log(err);
        return res.status(401).json({
          err: err,
          message: "Manufacturer username/name already in use" 
        })
      });
})

app.get("/manufacturer/get", (req, res, next) => {
  User.find({
    userType: "manufacturer"
  }).then(document => {
    res.status(200).json({
      message: "Nodes fetched successfully",
      manufacturers: document
    })
  },err => {
    console.log(err);
  })
})

app.delete("/manufacturer/delete/:id", (req, res, next) => {
  User.deleteOne({username: req.params.id})
    .then(response =>{
      res.status(200).json({
        message: "Manufacturer has been deleted"
      })
    }, reject => {
      res.status(401).json({
        message: "Error has occured"
      })
    })
})

//Node APIs
app.get("/nodes/getAll", (req, res, next) => {
  Node.find().then(document => {
    res.status(200).json({
      message: "Nodes fetched successfully",
      nodes: document
    });
  })
})

app.post("/nodes/add", (req, res, next) => {
  const newNode = new Node({
    nodeName: req.body.nodeName,
    nodeURL: req.body.nodeURL,
  })
  
  newNode.save()
    .then(newNode => {
      return res.status(200).json({
        newNode: newNode,
        message: "New node successfully created"
      })
    }).catch(err =>{
      return res.status(401).json({
        err: err,
        message: "Node name/URL is already in use." 
      })
    })
  
})

app.put("/nodes/update/:id", (req, res, next) => {
  Node.updateOne({_id:req.params.id}, req.body)
    .then(updatedNode =>{
      return res.status(200).json({
        message: "The node has been updated"
      })
    }).catch(err => {
      return res.status(401).json({
        err: err,
        message: "Node update failed" 
      })
    })
})

app.delete("/nodes/delete/:id", (req, res, next) => {
  Node.deleteOne({_id: req.params.id})
    .then(response =>{
      res.status(200).json({
        message: "Node has been deleted"
      })
    }, reject => {
      res.status(401).json({
        message: "Error has occured"
      })
    })
})

/*
app.post("/nodes/execute", (req, res, next) => {
  /*
    exec("npm run anotherTest", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
      res.json("ok")
  });
  
  const ls = exec(`node "${req.body.blockchainAPIPath}" ${req.body.nodeName} ${req.body.nodeURL}`)
  
  ls.stdout.on('data', (data) => {
    console.log(`${data}`);
    res.json({
      message: "Blockchain connection sucessful"
    })
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.json({
      message: "Blockchain connection failed"
    })
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });


  
})
*/
module.exports = app;