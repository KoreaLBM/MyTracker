
// functions/gld.js

exports.handler = async function () {
  const fetch = await import('node-fetch'); // ESM 방식
  const apiKey = process.env.FINANCE_API_KEY;
  const symbol = 'GLD';
  const url = `https://yfapi.net/v6/finance/quote?symbols=${symbol}`;

  try {
    const response = await fetch.default(url, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    const data = await response.json();
    const price = data.quoteResponse.result[0]?.regularMarketPrice;

    return {
      statusCode: 200,
      body: JSON.stringify({ gld: `$${price}` }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};