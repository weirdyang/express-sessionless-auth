const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, 'Product name can not be blank'],
    unique: true,
    minLength: [6, 'Product name needs to be at least 6 characters'],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Product description can not be blank'],
    unique: false,
    minLength: [6, 'Product description needs to be at least 6 characters'],
  },
  productType: {
    type: String,
    required: [true, 'Product type can not be blank'],
    unique: false,
    minLength: [6, 'Product type needs to be at least 6 characters'],
  },
  image:
  {
    data: Buffer,
    contentType: String,
  },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

productSchema.plugin(uniqueValidator, { message: '{PATH} already exists in the database' });
const Product = mongoose.model('Product', productSchema);
module.exports = {
  Product,
};
