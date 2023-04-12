const router = require('express').Router();
const { getSubcategories, getSubcategoriesByCategory, getSubcategory, createSubcategory, updateSubcategory, deleteSubcategory } = require('../controllers/subcategoriesController');

router.route('/').get(getSubcategories).post(createSubcategory);
router.route('/:id').get(getSubcategory).put(updateSubcategory).delete(deleteSubcategory);
router.route('/category/:category_id').get(getSubcategoriesByCategory);

module.exports = router;