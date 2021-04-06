const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

const itemSchema = mongoose.Schema({ 
itemId: {type: String, required: true, unique: true},
  itemName: {type: String, required: true},
  description: {type: String, required: true},
  status:     {type: String, required: true},
  comment: {type: String, required: true},
  location: {type: String, required: true},
  expiryDate: {type: Date, required: true},
  collectionDate: {type: Date, required: true},
  madeBy: {type: String},

});

itemSchema.plugin(uniqueValidator);
