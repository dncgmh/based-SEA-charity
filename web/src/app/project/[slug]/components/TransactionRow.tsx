import { explorerTxUrl, formatCurrency, shortenAddress } from '@/lib/common';
import { useName } from '@coinbase/onchainkit/identity';
import { format } from 'date-fns';
import Link from 'next/link';
import { base } from 'wagmi/chains';

export default function TransactionRow({ transaction, setting }) {
  const basename = useName({ address: transaction.from, chain: base });
  return (
    <tr key={transaction._id}>
      <td>{format(new Date(transaction.createdAt), 'PPpp')}</td>
      <td>
        <div
          className="tooltip"
          data-tip={formatCurrency(transaction.amount * setting.etherPrice, { fractionDigits: 6 })}>
          {formatCurrency(transaction.amount * setting.etherPrice)}
        </div>
      </td>
      <td>{basename.data || shortenAddress(transaction.from)}</td>
      <td className="max-w-xs truncate">{transaction.message}</td>
      <td>
        <Link href={explorerTxUrl(transaction.txHash)} target="_blank">
          <button className="btn btn-info btn-xs">View Details</button>
        </Link>
      </td>
    </tr>
  );
}
