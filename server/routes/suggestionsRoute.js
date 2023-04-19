const router = require('express').Router();
const { handleChat } = require('../controllers/suggestionsController')

router.route('/').post(handleChat)

module.exports = router;