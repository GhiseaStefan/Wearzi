const router = require('express').Router();
const { loginAdmin, logoutAdmin, authAdmin } = require('../controllers/adminController');

router.route('/login').post(loginAdmin);
router.route('/logout').get(logoutAdmin);
router.route('/auth').get(authAdmin);

module.exports = router;