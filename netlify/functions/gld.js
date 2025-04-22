exports.handler = async function(event, context) {
    const url = 'https://yh-finance.p.rapidapi.com/stock/v3/get-summary?symbol=GLD&region=US';
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '6c865307d1mshb2bed331dc6fcb9p144e85jsn11938ccbd041',  // ← 꼭 너의 키로 바꿔줘
        'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
  
      // 전체 응답을 로그로 확인
      return {
        statusCode: 200,
        body: JSON.stringify(data, null, 2)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };