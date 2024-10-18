import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Pagination from 'rc-pagination';
import { useAtom } from 'jotai';
import transactionRefreshAtom from '@/stores/transaction-refresh';
import { useSetting } from '@/hooks/use-setting';
import TransactionRow from '@/app/project/[slug]/components/TransactionRow';
import Loading from '@/components/Loading';

export default function ProjectList({ projectId = null }) {
  const [transactions, setTransactions] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('donate');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [transactionRefresh] = useAtom(transactionRefreshAtom);
  const { setting } = useSetting();
  const pageSize = 10;

  useEffect(() => {
    setTransactions([]);
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
      return <button className="join-item btn">«</button>;
    }
    if (type === 'next') {
      return <button className="join-item btn">»</button>;
    }
    return element;
  };

  const TransactionTable = () => (
    <div className="overflow-x-auto">
      <table className="table-zebra table w-full">
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
            <TransactionRow key={transaction._id} transaction={transaction} setting={setting} />
          ))}
        </tbody>
      </table>
      {_loading ? (
        <Loading />
      ) : transactions.length ? (
        <></>
      ) : (
        <div className="w-full py-4">
          <p className="text-center text-slate-600 text-sm">No transactions found.</p>
        </div>
      )}
    </div>
  );

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="mb-6 font-bold text-3xl">Transaction History</h1>
      <div className="tabs tabs-boxed mb-6 justify-center">
        <button
          className={`tab ${activeTab === 'donate' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('donate')}>
          Donations
        </button>
        <button
          className={`tab ${activeTab === 'withdraw' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('withdraw')}>
          Withdrawals
        </button>
      </div>

      <TransactionTable />

      {totalItems > pageSize && (
        <div className="mt-8 flex justify-center">
          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={setCurrentPage}
              className="join"
              itemRender={itemRender}
            />
          </div>
        </div>
      )}
    </div>
  );
}
