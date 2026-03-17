const yahooFinance = require('yahoo-finance2').default;

async function test() {
  try {
    const results = await yahooFinance.search('reli');
    console.log(JSON.stringify(results.quotes.slice(0, 2), null, 2));
  } catch (err) {
    console.error(err);
  }
}
test();
