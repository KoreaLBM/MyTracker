const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function () {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://finance.naver.com/item/main.nhn?code=489250', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    await page.waitForSelector('.no_today .blind', { timeout: 5000 });

    const price = await page.$eval('.no_today .blind', el => el.innerText.trim());

    return {
      statusCode: 200,
      body: JSON.stringify({ dividend: price }),
    };
  } catch (err) {
    console.error('에러 발생:', err.message);
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