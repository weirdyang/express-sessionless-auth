const debug = require('debug')('app:products.controller');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer');

const { errorFormatter, handleError } = require('../formatters');
const HttpError = require('../models/http-error');
const { Product } = require('../models/product');
const { roles } = require('../models/user');

const inMemoryStorage = multer.memoryStorage();
const MAX_SIZE = 10 * 1024 * 1024;

const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const fileFilter = (req, file, cb) => {
  if (validTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(null, false);
  return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
};
const uploadStrategy = multer(
  {
    storage: inMemoryStorage,
    fileFilter,
    limits: {
      fileSize: MAX_SIZE,
    },
  },
).single('file');

const createProduct = async (req, res, next) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    debug(result);
    debug(result.errors);
    return next(new HttpError('Invalid inputs', 422, result.array()));
  }
  let newProduct;
  try {
    newProduct = new Product({
      name: req.body.name,
      user: req.user.id,
      description: req.body.description,
      productType: req.body.productType,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await newProduct.save();
    return res.status(200).send({ message: `${newProduct.name} saved`, product: newProduct });
  } catch (error) {
    debug(error);
    return handleError(error, next);
  }
};
const fetchAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}, '-image');

    return res.json({ products, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};
const fetchProductsByUser = async (req, res, next) => {
  try {
    debug(req.user.id);
    debug(req.params.id);

    const products = await Product.find({ user: req.params.id }, '-image');
    return res.json({ products, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};
const fetchProductsForProfile = async (req, res, next) => {
  try {
    debug(req.user.id);
    debug(req.params.id);
    const products = await Product.find({ user: req.user.id }, '-image');
    return res.json({ products, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};
const fetchProductImage = async (req, res, next) => {
  try {
    const productId = mongoose.Types.ObjectId(req.params.id);
    const product = await Product.findById(productId);
    const img = Buffer.from(product.image.data, 'base64');

    res.writeHead(200, {
      'Content-Type': product.image.contentType,
      'Content-Length': img.length,
    });
    return res.end(img);
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};
const updateProductDetails = async (req, res, next) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    debug(result);
    return next(new HttpError('Invalid inputs', 422, result.array()));
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
      },
      { new: true },
    );
    return res.json({ product, id: req.user.id });
  } catch (error) {
    return handleError(error, next);
  }
};
const updateProductImage = async (req, res, next) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    debug(result);
    return next(new HttpError('Invalid inputs', 422, result.array()));
  }
  try {
    const productId = mongoose.Types.ObjectId(req.params.id);
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      {
        user: req.user.id,
      },
      { new: true },
    );
    return res.json({ product, id: req.user.id });
  } catch (error) {
    return handleError(error, next);
  }
};
const updateProduct = async (req, res, next) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    debug(result);
    return next(new HttpError('Invalid inputs', 422, result.array()));
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
    return handleError(error, next);
  }
};
const deleteProduct = async (req, res, next) => {
  if (req.user.role !== roles.superuser) {
    return next(
      new HttpError(`Only ${roles.superuser} can delete products`, 401),
    );
  }
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
    const products = await Product.findById(productId).populate('user');
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
  fetchProductImage,
  fetchProductsByUser,
  fetchProductsForProfile,
  updateProductDetails,
  updateProductImage,
  validTypes,
};
