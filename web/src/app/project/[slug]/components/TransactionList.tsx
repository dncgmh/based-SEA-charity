import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { explorerTxUrl, formatCurrency, shortenAddress } from '@/lib/common';
import Pagination from 'rc-pagination';
import { useAtom } from 'jotai';
import transactionRefreshAtom from '@/stores/transaction-refresh';
import Link from 'next/link';
import { useSetting } from '@/hooks/use-setting';

export default function ProjectList({ projectId = null }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('donate');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [transactionRefresh] = useAtom(transactionRefreshAtom);
  const { setting } = useSetting();
  const pageSize = 10;

  useEffect(() => {
    fetchTransactions();
  }, [activeTab, currentPage, projectId]);

  useEffect(() => {
    setTimeout(() => fetchTransactions(), 2000);
  }, [transactionRefresh]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.transaction.getList({ pageSize, pageNumber: currentPage, type: activeTab, projectId });
      setTransactions(data.data);
      setTotalItems(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const itemRender = (current, type, element) => {
    if (type === 'page') {
      return <button className={`join-item btn ${current === currentPage ? 'btn-active' : ''}`}>{current}</button>;
    }
    if (type === 'prev') {
      return <button className='join-item btn'>«</button>;
    }
    if (type === 'next') {
      return <button className='join-item btn'>»</button>;
    }
    return element;
  };

  const TransactionTable = () => (
    <div className='overflow-x-auto'>
      <table className='table-zebra table w-full'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>From</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{format(new Date(transaction.createdAt), 'PPpp')}</td>
              <td>
                <div className='tooltip' data-tip={formatCurrency(transaction.amount * setting.etherPrice, { fractionDigits: 6 })}>
                  {formatCurrency(transaction.amount * setting.etherPrice)}
                </div>
              </td>
              <td>{shortenAddress(transaction.from)}</td>
              <td className='max-w-xs truncate'>{transaction.message}</td>
              <td>
                <Link href={explorerTxUrl(transaction.txHash)} target='_blank'>
                  <button className='btn btn-info btn-xs'>View Details</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (error) {
    return <div className='alert alert-error'>{error}</div>;
  }

  return (
    <div className='container mx-auto px-4 py-4'>
      <h1 className='mb-6 font-bold text-3xl'>Transaction History</h1>

      <div className='tabs tabs-boxed mb-6 justify-center'>
        <button className={`tab ${activeTab === 'donate' ? 'tab-active' : ''}`} onClick={() => handleTabChange('donate')}>
          Donations
        </button>
        <button className={`tab ${activeTab === 'withdraw' ? 'tab-active' : ''}`} onClick={() => handleTabChange('withdraw')}>
          Withdrawals
        </button>
      </div>

      {transactions.length > 0 ? <TransactionTable /> : <p className='text-center text-gray-500'>No transactions found.</p>}

      {totalItems > pageSize && (
        <div className='mt-8 flex justify-center'>
          <div className='mt-6 flex justify-center'>
            <Pagination current={currentPage} total={totalItems} pageSize={pageSize} onChange={setCurrentPage} className='join' itemRender={itemRender} />
          </div>
        </div>
      )}
    </div>
  );
}
