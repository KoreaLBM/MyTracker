// netlify/functions/bitcoin.js
const axios = require("axios");

exports.handler = async function () {
  try {
    // 바이낸스 가격 (달러)
    const binanceRes = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const usdPrice = parseFloat(binanceRes.data.price);

    // 환율 정보
    const fxRes = await axios.get("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const usdKrw = fxRes.data.rates.KRW;

    return {
      statusCode: 200,
      body: JSON.stringify({
        usdPrice,
        usdKrw,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "데이터 불러오기 실패", details: err.message }),
    };
  }
};