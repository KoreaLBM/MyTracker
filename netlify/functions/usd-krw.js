const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const dataFile = path.join(__dirname, "usd-krw-cache.json");

exports.handler = async function () {
  try {
    // 오늘 환율 가져오기
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    const todayRate = data?.rates?.KRW;

    if (!todayRate) throw new Error("오늘 환율을 가져올 수 없음");

    // 어제 환율 불러오기 (파일 없으면 0으로 초기화)
    let yestRate = 0;
    if (fs.existsSync(dataFile)) {
      const file = fs.readFileSync(dataFile, "utf-8");
      const parsed = JSON.parse(file);
      yestRate = parsed.rate || 0;
    }

    // 변화량 계산
    const change = (todayRate - yestRate).toFixed(2);
    const sign = change > 0 ? "+" : "";
    const formattedChange = yestRate === 0 ? "" : `${sign}${change}`;

    // 오늘 환율 저장 (내일 대비용)
    fs.writeFileSync(dataFile, JSON.stringify({ rate: todayRate }), "utf-8");

    return {
      statusCode: 200,
      body: JSON.stringify({
        rate: todayRate.toFixed(2),
        change: formattedChange,
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