exports.handler = async function(event, context) {
    const url = 'https://yh-finance.p.rapidapi.com/stock/v2/get-summary?symbol=GLD&region=US';
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '6c865307d1mshb2bed331dc6fcb9p144e85jsn11938ccbd041', // RapidAPI에서 복사한 키
        'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      const price = data.price?.regularMarketPrice?.raw;
  
      return {
        statusCode: 200,
        body: JSON.stringify({ price })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };