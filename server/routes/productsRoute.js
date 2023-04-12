const router = require('express').Router();
const { getProducts, getProductsByCategory, getProductsBySubcategory, getProductsByProductType, getProduct, createProduct, updateProduct, deleteProduct, uploadImage } = require('../controllers/productController');

router.route('/').get(getProducts).post(createProduct);
router.route('/images').post(uploadImage);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);
router.route('/category/:category_id').get(getProductsByCategory);
router.route('/subcategory/:subcategory_id').get(getProductsBySubcategory);
router.route('/productType/:product_type_id').get(getProductsByProductType);

module.exports = router;