const Portfolio = require('../models/Portfolio');

const analyzePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio || portfolio.stocks.length === 0) {
      return res.status(400).json({ 
        message: 'No portfolio found. Please add stocks before running analysis.' 
      });
    }

    // Dynamic mock logic to generate numbers based on portfolio size/composition
    const sectorSet = new Set(portfolio.stocks.map(s => s.sector));
    const diversificationScore = Math.min(100, Math.round((sectorSet.size / 5) * 60 + 20 + (Math.random() * 10)));
    
    // Risk inversely proportional to diversification just to have pseudo-logic
    const riskScore = Math.max(10, Math.round(100 - diversificationScore + (Math.random() * 15)));
    
    const portfolioHealth = Math.round((diversificationScore + (100 - riskScore)) / 2 + 10);

    const recommendations = [
      "Consider index ETFs for long-term consistency and broader diversification.",
    ];

    if (sectorSet.has('Banking')) {
      recommendations.push("Monitor banking exposure closely for sector-specific regulatory risks.");
    } else {
      recommendations.push("Add financial or banking stocks to capture growth in credit cycles.");
    }

    if (sectorSet.has('Energy') && sectorSet.has('IT')) {
      recommendations.push("Good balance between Energy (Value) and IT (Growth) sectors.");
    } else {
      recommendations.push("Increase defensive balance by exploring FMCG or Healthcare allocations.");
    }

    res.status(200).json({
      diversificationScore,
      riskScore: Math.min(100, riskScore),
      portfolioHealth: Math.min(100, portfolioHealth),
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during portfolio analysis', error: error.message });
  }
};

module.exports = {
  analyzePortfolio,
};