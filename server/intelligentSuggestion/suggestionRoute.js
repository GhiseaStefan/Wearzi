const router = require('express').Router();
const { startTraining } = require('./suggestionTrainModel');
const { uploadImageSuggestion, getSuggestion } = require('./suggestionController');

router.route('/').get(startTraining);
router.route('/getSuggestion').get(getSuggestion).post(uploadImageSuggestion);

module.exports = router;