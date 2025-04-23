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

    // 각 ETF마다 새로운 탭(page)을 열고, 해당 페이지에서 가격을 가져오는 방식
    const urls = {
      snp500: 'https://finance.naver.com/item/main.nhn?code=143850',
      nasdaq: 'https://finance.naver.com/item/main.nhn?code=379800',
      dividend: 'https://finance.naver.com/item/main.nhn?code=354500',
      bondmix: 'https://finance.naver.com/item/main.nhn?code=329200',
    };

    const results = {};

    for (const [key, url] of Object.entries(urls)) {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const price = await page.$eval('.no_today .blind', el => el.innerText);
      results[key] = price;
      await page.close();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results),
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