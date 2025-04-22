async function fetchNaverPrice(code, element) {
  try {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://finance.naver.com/item/main.nhn?code=${code}`);
    const text = await response.text();
    const priceMatch = text.match(/<strong class="tah p11">([0-9,]+)<\/strong>/);
    if (priceMatch && priceMatch[1]) {
      element.textContent = priceMatch[1] + '원';
    } else {
      element.textContent = '가격 정보 없음';
    }
  } catch (err) {
    element.textContent = '불러오기 실패';
    console.error(err);
  }
}

// 네이버 종목코드
// TIGER S&P500: 143850
// TIGER 나스닥100: 133690

const snpElem = document.querySelector('#tiger-snp500 .price');
const nasdaqElem = document.querySelector('#tiger-nasdaq .price');

fetchNaverPrice('143850', snpElem);
fetchNaverPrice('133690', nasdaqElem);

// 아래는 Yahoo Finance API로 GLD 가져오기
const gldElem = document.querySelector('#gld .price');

async function fetchPrice(ticker, element) {
  try {
    const res = await fetch(
      `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${ticker}&region=US`,
      {
        headers: {
          'X-RapidAPI-Key': '여기에_발급받은_키',
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      }
    );
    const data = await res.json();
    const price = data.price?.regularMarketPrice?.raw;
    element.textContent = price ? `$${price}` : '가격 정보 없음';
  } catch (err) {
    element.textContent = '불러오기 실패';
    console.error(err);
  }
}

fetchPrice('GLD', gldElem);