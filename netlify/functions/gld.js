// const fetch = require('node-fetch');

// exports.handler = async function(event, context) {
//   try {
//     const response = await fetch('https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=GLD&region=US', {
//       method: 'GET',
//       headers: {
//         'X-RapidAPI-Key': '6c865307d1mshb2bed331dc6fcb9p144e85jsn11938ccbd041',
//         'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
//       }
//     });

//     const data = await response.json();
//     const price = data.price.regularMarketPrice.raw;

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ price })
//     };
//   } catch (err) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Failed to fetch GLD price' })
//     };
//   }
// };

exports.handler = async function(event, context) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "서버리스 함수 작동 중!" })
    };
  };