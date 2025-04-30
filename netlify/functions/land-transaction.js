// netlify/functions/land-transaction.js
const axios = require('axios');

exports.handler = async function () {
  const API_KEY = process.env.API_KEY;
  const LAWD_CD = '41430'; // 의왕시
  const now = new Date();

  // 최근 3개월 생성
  const searchMonths = [...Array(3)].map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

  try {
    for (const DEAL_YMD of searchMonths) {
      const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?` +
                  `serviceKey=${encodeURIComponent(API_KEY)}` +
                  `&LAWD_CD=${LAWD_CD}` +
                  `&DEAL_YMD=${DEAL_YMD}` +
                  `&_type=json&pageNo=1&numOfRows=100`;

      const { data } = await axios.get(url);
      const items = data?.response?.body?.items?.item;

      if (!items) continue;

      const allNames = Array.isArray(items) ? items.map(i => i.aptNm) : [items.aptNm];
      console.log(`📋 [${DEAL_YMD}] 아파트 이름 목록: ${[...new Set(allNames)].join(', ')}`);

      const filtered = (Array.isArray(items) ? items : [items])
        .filter(item =>
          item.aptNm.includes('인덕원센트럴푸르지오') &&
          item.excluUseAr >= 59 && item.excluUseAr <= 60
        )
        .sort((a, b) => {
          const dateA = new Date(`${a.dealYear}-${a.dealMonth}-${a.dealDay}`);
          const dateB = new Date(`${b.dealYear}-${b.dealMonth}-${b.dealDay}`);
          return dateB - dateA;
        });

      if (filtered.length > 0) {
        const latest = filtered[0];
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            apartment: latest.aptNm,
            area: latest.excluUseAr,
            price: latest.dealAmount,
            floor: latest.floor,
            date: `${latest.dealYear}.${String(latest.dealMonth).padStart(2, '0')}.${String(latest.dealDay).padStart(2, '0')}`
          })
        };
      }
    }

    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: '82A 실거래 내역 없음 (최근 3개월)' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ error: 'API 호출 실패', details: err.message })
    };
  }
};