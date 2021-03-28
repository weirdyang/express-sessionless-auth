const mongoose = require('mongoose');

const { Schema } = mongoose;

// blueprint of request
const originSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

// "Journals" is the collection name which will appear in db as tab
module.exports = mongoose.model('Origin', originSchema);
