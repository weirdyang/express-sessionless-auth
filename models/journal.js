const mongoose = require('mongoose');

const { Schema } = mongoose;

// blueprint of request
const journalSchema = new Schema({
  title: { type: String, required: true },
  entry: { type: String, required: true },
  dateOfEntry: { type: Date, required: true },
  // here we provide relation between place and user schema, ref should be the model name
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

// "Journals" is the collection name which will appear in db as tab
module.exports = mongoose.model('Journal', journalSchema);
