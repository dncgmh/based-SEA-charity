import { baseSepolia } from 'wagmi/chains';
import dayjs from 'dayjs';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

export const shortenAddress = (address: string) => {
  if (!address) {
    return '';
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const explorerAddressUrl = (address) => {
  return `${baseSepolia.blockExplorers.default.url}/address/${address}`;
};

export const explorerTxUrl = (tx) => {
  return `${baseSepolia.blockExplorers.default.url}/tx/${tx}`;
};

export const formatCurrency = (value: number, options: { fractionDigits?: number; prefix?: string; hideSymbol?: boolean } = {}) => {
  value = value || 0;
  let returnValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: options.fractionDigits ?? 2,
    maximumFractionDigits: options.fractionDigits ?? 2,
  }).format(value);
  if (options.prefix) {
    returnValue = `${options.prefix} ${returnValue}`;
  }
  if (options.hideSymbol) {
    returnValue = returnValue.replace(/[$,]/g, '');
  }
  return returnValue;
};

export const getRemainingDate = (date) => {
  return dayjs(date).fromNow();
};

export const formatDate = date => {
  return dayjs(date).format('YYYY-MM-DD');
}