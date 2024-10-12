import axios from 'axios';
import { config } from '../config';

const instance = axios.create({
  baseURL: config.basescan.url,
});

let cachedPrice: any = null;
let lastFetchTime = 0;

async function getEtherLastPrice() {
  const now = Date.now();

  if (cachedPrice && now - lastFetchTime < 60000) {
    return cachedPrice;
  }

  try {
    const res = await instance.get('/api', {
      params: {
        module: 'stats',
        action: 'ethprice',
        apikey: config.basescan.apiKey,
      },
    });

    cachedPrice = res.data.result?.ethusd;
    lastFetchTime = now;
    return cachedPrice;
  } catch (error) {
    console.error('Error fetching Ether price:', error);
    throw error;
  }
}

export const basescan = {
  getEtherLastPrice,
};
