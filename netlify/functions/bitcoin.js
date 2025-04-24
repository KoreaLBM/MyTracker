// netlify/functions/bitcoin.js
const axios = require("axios");

exports.handler = async function () {
  try {
    // 업비트 원화 가격
    const upbitRes = await axios.get("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const krwPrice = upbitRes.data[0].trade_price;

    // 바이낸스 달러 가격
    const binanceRes = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const usdPrice = parseFloat(binanceRes.data.price);

    // USD/KRW 환율 (이미 기존 함수 있음)
    const fxRes = await axios.get("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const usdKrw = fxRes.data.rates.KRW;

    const globalKrw = usdPrice * usdKrw;
    const premium = (((krwPrice - globalKrw) / globalKrw) * 100).toFixed(2);

    return {
      statusCode: 200,
      body: JSON.stringify({
        krwPrice: krwPrice.toLocaleString(),
        premium,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "비트코인 데이터를 불러올 수 없음", details: err.message }),
    };
  }
};