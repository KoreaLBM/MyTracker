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

    const urls = {
      snp500: 'https://finance.naver.com/item/main.nhn?code=143850',
      nasdaq: 'https://finance.naver.com/item/main.nhn?code=379800',
      dividend: 'https://finance.naver.com/item/main.nhn?code=354500',
      bondmix: 'https://finance.naver.com/item/main.nhn?code=329200',
    };

    const results = {};
    const page = await browser.newPage();

    for (const [key, url] of Object.entries(urls)) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // 핵심: 페이지 로딩을 기다려 안정성 확보
      await page.waitForSelector('.no_today .blind');
      const price = await page.$eval('.no_today .blind', el => el.innerText.trim());
      results[key] = price;

      // 잠깐 지연을 주면 더 안정적
      await new Promise(res => setTimeout(res, 500));
    }

    await page.close();

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