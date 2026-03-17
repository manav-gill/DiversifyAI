const express = require('express');
const { analyzePortfolio } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/portfolio', protect, analyzePortfolio);

module.exports = router;