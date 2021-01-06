const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

const nodeSchema = mongoose.Schema({
  nodeName: {type: String, required: true, unique: true},
  nodeURL: {type: String, required: true, unique: true},
});

nodeSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Node",nodeSchema);
