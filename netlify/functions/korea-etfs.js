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
      //	•	ETF마다 browser.newPage() → page.goto() → 크롤링 → page.close() 순으로 진행
      //	•	각 탭에서 에러가 나더라도 전체 실행은 중단되지 않음
      //	•	각 에러는 results[key] = '에러'로 처리되어 사용자에게 명확하게 표시됨
    const urls = {
      snp500: 'https://finance.naver.com/item/main.nhn?code=143850',
      nasdaq: 'https://finance.naver.com/item/main.nhn?code=379800',
      dividend: 'https://finance.naver.com/item/main.nhn?code=354500',
      bondmix: 'https://finance.naver.com/item/main.nhn?code=329200',
    };

    const results = {};

    for (const [key, url] of Object.entries(urls)) {
      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForSelector('.no_today .blind', { timeout: 5000 });

        const price = await page.$eval('.no_today .blind', el => el.innerText.trim());
        results[key] = price;
      } catch (e) {
        console.error(`${key} 에서 오류 발생:`, e.message);
        results[key] = '에러';
      } finally {
        await page.close();
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (err) {
    console.error('브라우저 레벨 에러:', err.message);
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