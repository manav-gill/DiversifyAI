const yahooFinance = require('yahoo-finance2').default;
async function test() {
  try {
    const q = await yahooFinance.quote('RELIANCE.NS');
    console.log("Pricing fetches are working:", q.regularMarketPrice);
  } catch (err) {
    console.log("Yahoo finance failed:", err.message);
  }
}
test();
