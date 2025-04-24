// netlify/functions/usd-krw.js
const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    const todayRate = data?.rates?.KRW;

    if (!todayRate) throw new Error("오늘 환율을 가져올 수 없음");

    return {
      statusCode: 200,
      body: JSON.stringify({
        rate: todayRate.toFixed(2),
        change: "", // 캐시 안 쓰니까 변화량 표시 불가
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "USD/KRW 계산 실패",
        details: err.message,
      }),
    };
  }
};