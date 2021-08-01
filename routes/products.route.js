const express = require('express');
const { check } = require('express-validator');

const {
  createProduct,
  fetchAllProducts,
  updateProduct,
  uploadStrategy,
  fetchProductById,
  deleteProduct,
} = require('../controllers/products.controller');

const { auth } = require('./auth.route');

const router = express.Router();
const reqChecks = [
  check('name').not().isEmpty().bail(),
  check('description').not().isEmpty().bail(),
  check('file').not().isEmpty().bail(),
];
// all requests must be authenticated
router.use(auth.jwt);

// create new product
router.post('/create', reqChecks, uploadStrategy, createProduct);

// return all products
router.get('/', fetchAllProducts);
// get specific journal
router.get('/:id', fetchProductById);
// get products for user
// todo: future feature
// router.get('/user/:id', fetchJournalsForUser);
// update product entry
router.put('/:id', reqChecks, uploadStrategy, updateProduct);
// delete
router.delete('/:id', deleteProduct);

module.exports = router;
