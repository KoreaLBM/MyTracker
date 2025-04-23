exports.handler = async function () {
  let browser = null;
  try {
    console.log("Launching browser...");
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: chromium.defaultViewport,
    });

    const page = await browser.newPage();
    const url = 'https://finance.naver.com/item/main.nhn?code=360750';
    console.log(`Navigating to ${url}`);
    await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.no_today .blind', { timeout: 5000 });
    const currentPrice = await page.$eval('.no_today .blind', el => el.innerText.trim());
    console.log("Current price:", currentPrice);

    const prevClose = await page.$eval(
      'table.no_info tr:nth-child(1) td:first-child span.blind',
      el => el.innerText.trim()
    );
    console.log("Previous close:", prevClose);

    return {
      statusCode: 200,
      body: JSON.stringify({ snp500: currentPrice, prevClose }),
    };
  } catch (err) {
    console.error('SNP500 크롤링 에러:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SNP500 에러: ' + err.message }),
    };
  } finally {
    if (browser) await browser.close();
  }
};