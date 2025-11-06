const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:52306/ko/', { waitUntil: 'networkidle0' });

  await page.pdf({
    path: './AKASSECT_Whitepaper.pdf',
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
})();
