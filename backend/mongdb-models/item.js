const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

const itemSchema = mongoose.Schema({ 
itemId: {type: String, required: true, unique: true},
  itemName: {type: String, required: true},
  description: {type: String, required: true},
  status:     {type: String, required: true},
  remarks: {type: String, required: true},
  location: {type: String, required: true},
  expiryDate: {type: String, required: true},
  collectionDate: {type: String, required: true},

});

itemSchema.plugin(uniqueValidator);
