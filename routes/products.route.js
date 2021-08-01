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
  validTypes,
} = require('../controllers/products.controller');

const { auth } = require('./auth.route');

const router = express.Router();

const reqChecks = [
  check('name').not().isEmpty().bail(),
  check('description').not().isEmpty().bail(),
  check('file')
    .custom((value, { req }) => {
      if (!req.file) return false;

      if (!validTypes.includes(req.file.mimetype)) {
        return false;
      }// return "falsy" value to indicate invalid data
      return true;
    })
    .withMessage('Please ensure a file is attached, and is png or jpg format'), // custom error message that will be send back if the file in not a pdf.

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
