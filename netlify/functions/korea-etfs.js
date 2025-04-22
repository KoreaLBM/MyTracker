// .netlify/functions/korea-etfs.js
const puppeteer = require('puppeteer');

exports.handler = async function (event, context) {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto('https://finance.naver.com/item/main.nhn?code=143850');
    const price1 = await page.$eval('.no_today .blind', el => el.innerText);

    await page.goto('https://finance.naver.com/item/main.nhn?code=379800');
    const price2 = await page.$eval('.no_today .blind', el => el.innerText);

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        snp500: price1,
        nasdaq: price2,
      }),
    };
  } catch (err) {
    console.error('에러 발생:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};