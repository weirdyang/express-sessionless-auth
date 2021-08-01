const debug = require('debug')('app:products.controller');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer');

const { errorFormatter } = require('../formatters');
const HttpError = require('../models/http-error');
const Product = require('../models/product');

const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('file');

const createProduct = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    debug(errors);
    return next(new HttpError('Invalid inputs', 422, errors.array()));
  }
  let newProduct;
  try {
    newProduct = new Product({
      name: req.body.name,
      user: req.user.id,
      description: req.body.description,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await newProduct.save();
    return res.status(200).send({ message: `${newProduct.name} saved`, product: newProduct });
  } catch (error) {
    // return res.json(422).send('Error creating entry, please try again');
    return next(
      new HttpError(error.message, 422),
    );
  }
};
const fetchAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});

    return res.json({ products, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    debug(errors);
    return next(new HttpError('Invalid inputs', 422));
  }
  try {
    const { name, description } = req.body;
    const productId = mongoose.Types.ObjectId(req.params.id);
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      {
        name,
        description,
        user: req.user.id,
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      },
      { new: true },
    );
    return res.json({ product, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};
const deleteProduct = async (req, res) => {
  const productId = mongoose.Types.ObjectId(req.params.id);
  const product = await Product.findByIdAndRemove(productId);
  if (!product) {
    return res.status(404).send({ message: `no such product with ${productId}` });
  }
  return res.json({ product });
};

const fetchProductById = async (req, res, next) => {
  try {
    const productId = mongoose.Types.ObjectId(req.params.id);
    const products = await Product.findById(productId);
    return res.json({ products, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};

module.exports = {
  createProduct,
  fetchAllProducts,
  updateProduct,
  uploadStrategy,
  deleteProduct,
  fetchProductById,
};
