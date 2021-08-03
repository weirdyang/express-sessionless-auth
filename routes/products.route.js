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
  fetchProductsByUser,
  validTypes,
  fetchProductsForProfile,
} = require('../controllers/products.controller');

const { auth } = require('./auth.route');

const router = express.Router();
const fileCheck = check('file')
  .custom((value, { req }) => {
    if (!req.file) return false;

    if (!validTypes.includes(req.file.mimetype)) {
      return false;
    }// return "falsy" value to indicate invalid data
    return true;
  })
  .withMessage('Please ensure a file is attached, and is png or jpg format');
const nameCheck = check('name').not().isEmpty().bail();
const descriptionCheck = check('description').not().isEmpty().bail();
const productTypeCheck = check('productType').not().isEmpty().bail();
const reqChecks = [
  nameCheck,
  descriptionCheck,
  fileCheck,
  productTypeCheck,
];
// all requests must be authenticated
router.use(auth.jwt);

// create new product
router.post('/create', uploadStrategy, reqChecks, createProduct);

// return all products
router.get('/', fetchAllProducts);
// get specific journal
router.get('/details/:id', fetchProductById);
// get products for user
router.get('/user/self', fetchProductsForProfile);
// get products for user by userId
router.get('/user/:id', fetchProductsByUser);
// update product entry
router.put('/:id', uploadStrategy, reqChecks, updateProduct);
// update product details
router.put('/details/:id', [nameCheck, descriptionCheck, productTypeCheck], updateProduct);
// update product image only
router.put('/image/:id', uploadStrategy, [fileCheck], updateProduct);
// delete
router.delete('/:id', deleteProduct);

router.get('/image/:id', fetchProductImage);
module.exports = router;
