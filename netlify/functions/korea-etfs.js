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

    await page.goto('https://finance.naver.com/item/main.nhn?code=143850');
    const price1 = await page.$eval('.no_today .blind', el => el.innerText);

    await page.goto('https://finance.naver.com/item/main.nhn?code=379800');
    const price2 = await page.$eval('.no_today .blind', el => el.innerText);

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
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};