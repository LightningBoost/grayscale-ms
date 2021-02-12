import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dayjs from 'dayjs';

const getGrayscaleAmount = async (): Promise<{
  shares: number;
  bitcoinsPerShare: number;
  date: Date;
}> => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://grayscale.co/bitcoin-trust/');
    await page.waitForSelector(
      '.overview-data > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(2)'
    );
    await page.waitForSelector(
      '.overview-data > tbody:nth-child(1) > tr:nth-child(11) > td:nth-child(2)'
    );
    await page.waitForSelector('.disclaimer-copy');

    // get total shares
    const shares = await page.$(
      '.overview-data > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(2)'
    );
    let sharesValue = await page.evaluate((el) => el.textContent, shares);
    sharesValue = sharesValue.replaceAll(',', '');
    sharesValue = sharesValue.replaceAll('‡', '');

    // get btc per share
    const btcShare = await page.$(
      '.overview-data > tbody:nth-child(1) > tr:nth-child(11) > td:nth-child(2)'
    );
    let btcShareValue = await page.evaluate((el) => el.textContent, btcShare);
    btcShareValue = btcShareValue.replaceAll('‡', '');

    // get date
    const dateText = await page.$('.disclaimer-copy');
    let date = await page.evaluate((el) => el.textContent, dateText);
    const datePos = date.search('‡');
    date = date.substring(datePos + 8);
    date = dayjs(date).toDate();

    // close browser
    await browser.close();

    return { shares: sharesValue, bitcoinsPerShare: btcShareValue, date };
  } catch (e) {
    await browser.close();
    throw e;
  }
};

export default getGrayscaleAmount;
