const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true, // always convert username to lowercase
    required: [true, 'this can not be blank'],
    unique: true,
    minLength: 6,
    trim: true,
    index: true,
    match: [/^[a-zA-Z0-9]+$/, 'no special characters'],
  },
  description: {
    type: String,
    lowercase: true, // always convert username to lowercase
    required: [true, 'this can not be blank'],
    unique: true,
    minLength: 6,
  },
  image:
    {
      data: Buffer,
      contentType: String,
    },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
