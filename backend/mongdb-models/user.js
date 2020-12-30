const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  userType: {type: String, required: true}
});

//userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User",userSchema); //Name of collection to insert,update and delete data from
