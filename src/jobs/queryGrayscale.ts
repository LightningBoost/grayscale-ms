import axios from 'axios';
import dayjs from 'dayjs';
import Currency from 'currency.js';
import getGrayscaleAmount from '../controllers/scraper';
import prisma from '../database';

const queryGrayscale = async (): Promise<void> => {
  try {
    const { date, shares, bitcoinsPerShare } = await getGrayscaleAmount();
    const lastUpdate = await prisma.purchases.findFirst({
      orderBy: { date: 'desc' },
    });

    // if data is already updated
    if (lastUpdate && dayjs(lastUpdate.date).isSame(dayjs(), 'day')) {
      return;
    }

    // if grayscale still didn't update the data, schedule to run in 1h
    if (lastUpdate && dayjs(lastUpdate.date).isSame(date, 'day')) {
      setTimeout(() => queryGrayscale(), 3.6e6);
      return;
    }

    // total of bitcoins in possession
    const total = Currency(shares).multiply(bitcoinsPerShare).value;

    // amount bought today by grayscale
    const boughtToday = Currency(total).subtract(lastUpdate?.total || 0).value;

    const {
      data: { last: btcPrice },
    } = await axios.get('https://www.bitstamp.net/api/v2/ticker/btcusd/');

    await prisma.purchases.create({
      data: {
        date,
        bought: boughtToday,
        shares,
        bitcoinsPerShare,
        fiat: Currency(boughtToday).multiply(btcPrice).value,
        total,
        bitcoinPrice: btcPrice,
      },
    });
  } catch (e) {
    console.log(e.message); // eslint-disable-line
    setTimeout(() => queryGrayscale(), 3.6e6);
  }
};

export default queryGrayscale;
