const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true, // always convert username to lowercase
    required: [true, 'this can not be blank'],
    unique: true,
    minLength: [6, 'Product name needs to be at least 6 characters'],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    lowercase: true, // always convert username to lowercase
    required: [true, 'this can not be blank'],
    unique: false,
    minLength: [6, 'Product description needs to be at least 6 characters'],
  },
  image:
    {
      data: Buffer,
      contentType: String,
    },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });
productSchema.plugin(uniqueValidator, { message: '{PATH} already exists in the database' });
module.exports = mongoose.model('Product', productSchema);
