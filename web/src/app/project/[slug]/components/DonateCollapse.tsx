'use client';

import { CircleCheck, CircleX, Info } from 'lucide-react';
import Link from 'next/link';
import { useEffect, type FormEvent } from 'react';
import { type Hex, parseEther } from 'viem';
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import contractJson from '@/contract-abis/CharityProjectDonation.json';
import { useAtom } from 'jotai';
import transactionRefreshAtom from '@/stores/transaction-refresh';

export default function DonateCollapse({ project }) {
  const [, setTransactionRefresh] = useAtom(transactionRefreshAtom);

  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const isEnded = new Date(project.endDate) < new Date();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get('address') as Hex;
    const value = formData.get('value') as string;
    const message = formData.get('message') as string;

    writeContract({
      abi: contractJson.abi as any,
      address: to,
      functionName: 'donate',
      args: [message],
      value: parseEther(value),
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setTransactionRefresh((prev) => prev + 1);
    }
  }, [isConfirmed, setTransactionRefresh]);

  return (
    <div className='collapse w-full bg-base-200'>
      <input disabled={isEnded} type='checkbox' />
      {isEnded ? (
        <div className='collapse-title w-full bg-slate-600 text-center font-medium text-lg text-white'>Ended</div>
      ) : (
        <div className='collapse-title w-full bg-sky-600 text-center font-medium text-lg text-white'>Donate Now</div>
      )}
      <div className='collapse-content'>
        <form onSubmit={submit} className='flex flex-col justify-center'>
          <input className='input input-bordered input-sm mt-2 w-full' name='address' value={project.contractAddress} placeholder='Address' required={true} />
          <input className='input input-bordered input-sm mt-2 w-full' name='value' placeholder='Amount (ETH)' type='number' step='0.000001' required={true} />
          <textarea className='textarea textarea-bordered mt-2 w-full' name='message' placeholder='Message' required={false} />
          <button className='btn btn-info mt-2 w-auto' disabled={isPending} type='submit'>
            {isPending ? 'Confirming...' : 'Send'}
          </button>
        </form>
        <div className='flex flex-col gap-2 truncate pt-2 text-sm hover:text-clip'>
          {hash && !isConfirmed && (
            <div role='alert' className='alert alert-info p-2'>
              <Info />
              <span>Transaction Hash:</span>
              <span>
                <Link target='_blank' href={`https://sepolia.basescan.org/tx/${hash}`}>
                  {hash}
                </Link>
              </span>
            </div>
          )}
          {isConfirming && (
            <div role='alert' className='alert alert-info p-2'>
              <Info />
              Waiting for confirmation...
            </div>
          )}
          {isConfirmed && (
            <div role='alert' className='alert alert-success p-2'>
              <CircleCheck />
              Transaction confirmed.
            </div>
          )}
          {error && (
            <div role='alert' className='alert alert-error p-2'>
              <CircleX />
              Error: {(error as BaseError).shortMessage || error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
