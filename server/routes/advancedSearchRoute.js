const router = require('express').Router();
const { advSearch } = require('../controllers/advancedSearchController')

router.route('/').post(advSearch)

module.exports = router;