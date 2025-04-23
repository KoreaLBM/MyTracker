// netlify/functions/us-etfs.js

exports.handler = async function () {
    const fetch = await import('node-fetch');
    const apiKey = process.env.FINANCE_API_KEY;
    const symbols = ['GLD', 'SMH', 'XLU', 'XLV'].join(',');
    const url = `https://yfapi.net/v6/finance/quote?symbols=${symbols}`;
  
    try {
      const response = await fetch.default(url, {
        headers: {
          'x-api-key': apiKey,
        },
      });
  
      const data = await response.json();
      const results = data.quoteResponse?.result;
  
      if (!results || results.length === 0) {
        throw new Error('No ETF data found.');
      }
  
      // 결과를 이름별로 매핑
      const etfData = {};
      results.forEach(item => {
        etfData[item.symbol] = `$${item.regularMarketPrice}`;
      });
  
      return {
        statusCode: 200,
        body: JSON.stringify(etfData),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  };