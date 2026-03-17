// backend/jobs/cronJobs.js
const cron = require('node-cron');
const { default: YahooFinance } = require('yahoo-finance2');
const yahooFinance = new YahooFinance();
const Portfolio = require('../models/Portfolio'); // Make sure path is right

// CRON logic to run everyday at Midnight
const startDailyPriceUpdate = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('--- [CRON START] Starting nightly portfolio price updates ---');
    try {
      const portfolios = await Portfolio.find({});

      for (let portfolio of portfolios) {
        let isUpdated = false;

        for (let idx = 0; idx < portfolio.stocks.length; idx++) {
          const stock = portfolio.stocks[idx];
          
          try {
            // Check yahoo finance for the symbol (appending .NS for NSE)
            const yahooSymbol = stock.symbol + '.NS'; 
            const quote = await yahooFinance.quote(yahooSymbol);
            
            if (quote && quote.regularMarketPrice) {
              const livePrice = quote.regularMarketPrice;
              // update currentValue which is the total value of that holding
              portfolio.stocks[idx].currentValue = livePrice * stock.quantity;
              isUpdated = true;
            }
          } catch (fetchErr) {
            console.error(`Error fetching price for ${stock.symbol}:`, fetchErr.message);
          }
        }

        if (isUpdated) {
          await portfolio.save();
          console.log(`Updated portfolio for user ${portfolio.user}`);
        }
      }

      console.log('--- [CRON END] Nightly price updates completed ---');
    } catch (err) {
      console.error('Error running nightly cron job:', err);
    }
  });
};

module.exports = { startDailyPriceUpdate };
