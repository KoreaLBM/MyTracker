const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function () {
  let browser = null;
  try {
    browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath() || '/tmp/chromium',
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport,
    });

    const page = await browser.newPage();
    const url = 'https://finance.naver.com/item/main.nhn?code=133690'; // TIGER 나스닥100
    await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.no_today .blind', { timeout: 5000 });
    const currentPrice = await page.$eval('.no_today .blind', el => el.innerText.trim());

    const prevClose = await page.$eval(
      'table.no_info tr:nth-child(1) td:first-child span.blind',
      el => el.innerText.trim()
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ nasdaq: currentPrice, prevClose }),
    };
  } catch (err) {
    console.error('NASDAQ100 크롤링 에러:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'NASDAQ100 에러: ' + err.message }),
    };
  } finally {
    if (browser) await browser.close();
  }
};