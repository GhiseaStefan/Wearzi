const router = require('express').Router();
const { loginAdmin, authAdmin } = require('../controllers/adminController');

router.route('/login').post(loginAdmin);
router.route('/auth').get(authAdmin);

module.exports = router;