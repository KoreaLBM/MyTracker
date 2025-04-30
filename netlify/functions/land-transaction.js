const axios = require('axios');

exports.handler = async function (event) {
  const API_KEY = process.env.API_KEY;
  const LAWD_CD = '41430';
  const now = new Date();

  const searchMonths = [...Array(3)].map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const query = event.queryStringParameters || {};
  const areaMin = parseFloat(query.areaMin) || 59;
  const areaMax = parseFloat(query.areaMax) || 60;

  let saleData = null;
  let rentData = null;

  for (const DEAL_YMD of searchMonths) {
    // 매매
    if (!saleData) {
      try {
        const saleRes = await axios.get(`https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev`, {
          params: {
            serviceKey: API_KEY,
            LAWD_CD,
            DEAL_YMD,
            _type: 'json',
            pageNo: 1,
            numOfRows: 100
          }
        });
        const items = saleRes?.data?.response?.body?.items?.item;
        const filtered = (Array.isArray(items) ? items : [items])
          .filter(i => i.aptNm.includes('인덕원센트럴푸르지오') && i.excluUseAr >= areaMin && i.excluUseAr < areaMax)
          .sort((a, b) => new Date(`${b.dealYear}-${b.dealMonth}-${b.dealDay}`) - new Date(`${a.dealYear}-${a.dealMonth}-${a.dealDay}`));
        if (filtered[0]) {
          const latest = filtered[0];
          saleData = {
            apartment: latest.aptNm,
            type: '매매',
            area: latest.excluUseAr,
            price: `${latest.dealAmount}만원`,
            floor: `${latest.floor}층`,
            date: `${latest.dealYear}.${String(latest.dealMonth).padStart(2, '0')}.${String(latest.dealDay).padStart(2, '0')}`
          };
        }
      } catch (e) {}
    }

    // 전세
    if (!rentData) {
      try {
        const rentRes = await axios.get(`https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent`, {
          params: {
            serviceKey: API_KEY,
            LAWD_CD,
            DEAL_YMD,
            _type: 'json',
            pageNo: 1,
            numOfRows: 100
          }
        });
        const items = rentRes?.data?.response?.body?.items?.item;
        const filtered = (Array.isArray(items) ? items : [items])
          .filter(i => i.aptNm.includes('인덕원센트럴푸르지오') && i.excluUseAr >= areaMin && i.excluUseAr < areaMax)
          .sort((a, b) => new Date(`${b.dealYear}-${b.dealMonth}-${b.dealDay}`) - new Date(`${a.dealYear}-${a.dealMonth}-${a.dealDay}`));
        if (filtered[0]) {
          const latest = filtered[0];
          rentData = {
            apartment: latest.aptNm,
            type: '전세',
            area: latest.excluUseAr,
            price: `${latest.deposit}만원`,
            floor: `${latest.floor}층`,
            date: `${latest.dealYear}.${String(latest.dealMonth).padStart(2, '0')}.${String(latest.dealDay).padStart(2, '0')}`
          };
        }
      } catch (e) {}
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ sale: saleData, rent: rentData })
  };
};