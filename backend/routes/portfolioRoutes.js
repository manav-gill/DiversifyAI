const express = require('express');
const { getPortfolio, addStockToPortfolio, getSectorDistribution, searchStocks, removeStockFromPortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', protect, searchStocks);
router.get('/sectors', protect, getSectorDistribution);
router.get('/', protect, getPortfolio);
router.post('/add', protect, addStockToPortfolio);
router.delete('/remove/:symbol', protect, removeStockFromPortfolio);

module.exports = router;