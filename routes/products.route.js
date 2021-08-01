const express = require('express');
const { check } = require('express-validator');

const {
  createProduct,
  fetchAllProducts,
  updateProduct,
  uploadStrategy,
  fetchProductById,
  deleteProduct,
  fetchProductImage,
} = require('../controllers/products.controller');

const { auth } = require('./auth.route');
const { route } = require('./journals.route');

const router = express.Router();
const reqChecks = [
  check('name').not().isEmpty().bail(),
  check('description').not().isEmpty().bail(),
  check('file').not().isNumeric().bail(),
];
// all requests must be authenticated
router.use(auth.jwt);

// create new product
router.post('/create', uploadStrategy, reqChecks, createProduct);

// return all products
router.get('/', fetchAllProducts);
// get specific journal
router.get('/:id', fetchProductById);
// get products for user
// todo: future feature
// router.get('/user/:id', fetchJournalsForUser);
// update product entry
router.put('/:id', uploadStrategy, reqChecks, updateProduct);
// delete
router.delete('/:id', deleteProduct);

router.get('/image/:id', fetchProductImage);
module.exports = router;
