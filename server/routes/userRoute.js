const router = require('express').Router();
const { registerUser, loginUser, authUser, logoutUser } = require('../controllers/userController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/auth').get(authUser);
router.route('/logout').get(logoutUser);

module.exports = router;