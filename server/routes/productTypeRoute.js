const router = require('express').Router();
const { getProductTypes, getProductTypesByCategory, getProductTypesBySubcategory, getProductType, createProductType, updateProductType, deleteProductType } = require('../controllers/productTypeController');

router.route('/').get(getProductTypes).post(createProductType);
router.route('/:id').get(getProductType).put(updateProductType).delete(deleteProductType);
router.route('/subcategory/:subcategory_id').get(getProductTypesBySubcategory);
router.route('/category/:category_id').get(getProductTypesByCategory);

module.exports = router;