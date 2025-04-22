exports.handler = async function(event, context) {
    const url = 'https://yh-finance.p.rapidapi.com/stock/v2/get-summary?symbol=GLD&region=US';
  
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '6c865307d1mshb2bed331dc6fcb9p144e85jsn11938ccbd041',
        'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      
      // 상태 코드가 200이 아닌 경우, 오류 메시지로 반환
      if (!response.ok) {
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: `HTTP Error: ${response.status}` })
        };
      }
  
      const text = await response.text();
  
      // text를 그대로 반환해서 실제 응답이 뭔지 보자
      return {
        statusCode: 200,
        body: text
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };