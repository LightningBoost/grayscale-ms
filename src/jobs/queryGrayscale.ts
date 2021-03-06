import axios from 'axios';
import Currency from 'currency.js';
import dayjs from 'dayjs';
import getGrayscaleAmount from '../controllers/scraper';
import prisma from '../database';

const queryGrayscale = async (): Promise<void> => {
  try {
    // last day
    const lastUpdate = await prisma.purchases.findFirst({
      orderBy: { date: 'desc' },
    });

    // execute scraper
    const { shares, bitcoinsPerShare } = await getGrayscaleAmount();

    // total of bitcoins in possession
    const total = Currency(shares).multiply(bitcoinsPerShare).value;

    // amount bought today by grayscale
    const boughtToday = Currency(total).subtract(lastUpdate?.total || 0).value;

    const {
      data: { last: btcPrice },
    } = await axios.get('https://www.bitstamp.net/api/v2/ticker/btcusd/');

    await prisma.purchases.create({
      data: {
        date: dayjs().toDate(),
        bought: boughtToday,
        shares,
        bitcoinsPerShare,
        fiat: Currency(boughtToday).multiply(btcPrice).value,
        total,
        bitcoinPrice: parseFloat(btcPrice),
      },
    });
  } catch (e) {
    console.log(e.message); // eslint-disable-line
    setTimeout(() => queryGrayscale(), 3.6e6);
  }
};

export default queryGrayscale;
