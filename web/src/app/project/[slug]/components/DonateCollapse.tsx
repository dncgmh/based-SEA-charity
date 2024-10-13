'use client';

import { useState, useEffect } from 'react';
import { CircleCheck, CircleX, Info } from 'lucide-react';
import Link from 'next/link';
import { type Hex, parseEther } from 'viem';
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import contractJson from '@/contract-abis/CharityProjectDonation.json';
import { useAtom } from 'jotai';
import transactionRefreshAtom from '@/stores/transaction-refresh';
import { explorerTxUrl, shortenAddress } from '@/lib/common';

interface FormData {
  value: string;
  message: string;
}

export default function DonateCollapse({ project }) {
  const [, setTransactionRefresh] = useAtom(transactionRefreshAtom);
  const [formData, setFormData] = useState<FormData>({ value: '', message: '' });
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const isEnded = new Date(project.endDate) < new Date();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      abi: contractJson.abi as any,
      address: project.contractAddress as Hex,
      functionName: 'donate',
      args: [formData.message],
      value: parseEther(formData.value),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const resetForm = () => {
    setFormData({ value: '', message: '' });
  };

  useEffect(() => {
    if (isConfirmed) {
      setTransactionRefresh((prev) => prev + 1);
      resetForm();
    }
  }, [isConfirmed, setTransactionRefresh]);

  return (
    <div className="collapse w-full bg-base-200">
      <input disabled={isEnded} type="checkbox" checked={!isCollapsed} onChange={() => setIsCollapsed(!isCollapsed)} />
      {isEnded ? (
        <div className="collapse-title w-full bg-slate-600 text-center font-medium text-lg text-white">Ended</div>
      ) : (
        <div className="collapse-title w-full bg-sky-600 text-center font-medium text-lg text-white">Donate Now</div>
      )}
      <div className="collapse-content">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center">
          <input
            readOnly={true}
            className="input input-bordered input-sm mt-2 w-full cursor-pointer"
            value={project.contractAddress}
            placeholder="Address"
            required={true}
          />
          <input
            name="value"
            className="input input-bordered input-sm mt-2 w-full"
            value={formData.value}
            onChange={handleInputChange}
            placeholder="Amount (ETH)"
            type="number"
            step="0.000001"
            required={true}
          />
          <textarea
            name="message"
            rows={3}
            className="textarea textarea-bordered mt-2 w-full"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Message"
          />
          <button className="btn btn-info mt-2 w-auto" disabled={isPending} type="submit">
            {isPending ? 'Confirming...' : 'Send'}
          </button>
        </form>
        <div className="flex flex-col gap-2 truncate pt-2 text-sm hover:text-clip">
          {hash && !isConfirmed && (
            <div role="alert" className="alert alert-info p-2">
              <Info />
              <span>Transaction Hash:</span>
              <span>
                <Link target="_blank" href={explorerTxUrl(hash)}>
                  <span>{shortenAddress(hash)}</span>
                </Link>
              </span>
            </div>
          )}
          {isConfirming && (
            <div role="alert" className="alert alert-info p-2">
              <Info />
              Waiting for confirmation...
            </div>
          )}
          {isConfirmed && (
            <div role="alert" className="alert alert-success p-2">
              <CircleCheck />
              Transaction confirmed.
            </div>
          )}
          {error && (
            <div role="alert" className="alert alert-error p-2">
              <CircleX />
              Error: {(error as BaseError).shortMessage || error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
