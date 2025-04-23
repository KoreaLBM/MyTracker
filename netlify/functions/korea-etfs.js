const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // TIGER 미국S&P500 (A143850)
    await page.goto('https://finance.naver.com/item/main.nhn?code=143850');
    const price1 = await page.$eval('.no_today .blind', el => el.innerText);

    // TIGER 나스닥100 (A379800)
    await page.goto('https://finance.naver.com/item/main.nhn?code=379800');
    const price2 = await page.$eval('.no_today .blind', el => el.innerText);

    // KODEX 미국배당다우존스 (A354500)
    await page.goto('https://finance.naver.com/item/main.nhn?code=354500');
    const price3 = await page.$eval('.no_today .blind', el => el.innerText);

    // KODEX 삼성전자채권혼합 (A329200)
    await page.goto('https://finance.naver.com/item/main.nhn?code=329200');
    const price4 = await page.$eval('.no_today .blind', el => el.innerText);

    return {
      statusCode: 200,
      body: JSON.stringify({
        snp500: price1,
        nasdaq: price2,
        dividend: price3,
        bondmix: price4,
      }),
    };
  } catch (err) {
    console.error('에러 발생:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};