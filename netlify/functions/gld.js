// netlify/functions/gld.js

exports.handler = async function () {
  const fetch = await import('node-fetch'); // ESM 방식으로 fetch 불러오기
  const apiKey = process.env.FINANCE_API_KEY; // .env 또는 Netlify 환경변수에 저장된 API 키
  const symbol = 'GLD'; // 가져올 ETF 심볼
  const url = `https://yfapi.net/v6/finance/quote?symbols=${symbol}`;

  try {
    const response = await fetch.default(url, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    const data = await response.json();

    // 데이터 확인용 로그 (원하는 경우 잠깐 넣었다가 제거 가능)
    console.log("API 응답 데이터:", data);

    // 오류 방지를 위해 방어적으로 처리
    const result = data.quoteResponse?.result;
    if (!result || result.length === 0) {
      throw new Error('quoteResponse.result is empty.');
    }

    const price = result[0].regularMarketPrice;

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