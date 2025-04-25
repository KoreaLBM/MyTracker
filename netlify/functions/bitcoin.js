const axios = require("axios");
const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 1. 업비트 KRW 시세
    const upbitRes = await axios.get("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const krwPrice = parseFloat(upbitRes.data[0].trade_price);

    // 2. 바이낸스 USD 시세
    const binanceRes = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const usdPrice = parseFloat(binanceRes.data.price);

    // 3. 환율: 다른 Netlify 함수에서 호출
    const baseUrl = process.env.URL || "http://localhost:8888"; // Netlify 배포 시 자동 설정됨
    const fxRes = await fetch(`${baseUrl}/.netlify/functions/usd-krw`);
    const fxData = await fxRes.json();

    if (!fxData.rate) {
      throw new Error("환율 데이터를 가져올 수 없음");
    }

    const usdKrw = parseFloat(fxData.rate);

    // 4. 김치 프리미엄 계산
    const globalKrw = usdPrice * usdKrw;
    const premium = ((krwPrice / globalKrw) - 1) * 100;

    return {
      statusCode: 200,
      body: JSON.stringify({
        krwPrice: Math.round(krwPrice),
        usdKrw: usdKrw.toFixed(2),
        premium: premium.toFixed(2),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "비트코인 데이터 계산 실패", details: err.message }),
    };
  }
};