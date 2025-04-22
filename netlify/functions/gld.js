exports.handler = async function (event, context) {
  const fetch = await import('node-fetch'); // 동적 import
  require('dotenv').config();
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
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};