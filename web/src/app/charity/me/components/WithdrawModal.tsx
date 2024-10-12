import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CircleCheck, CircleX, Info } from 'lucide-react';
import Link from 'next/link';
import { parseEther } from 'viem';
import { type BaseError, useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import contract from '../../../../../../smart-contract/artifacts/contracts/ChairtyProjectDonation.sol/CharityProjectDonation.json';

export default function WithdrawModal({ project }) {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    address: project?.contractAddress || '',
    value: '',
    message: '',
  });

  useEffect(() => {
    if (project) {
      setFormData((prev) => ({
        ...prev,
        address: project.contractAddress,
      }));
    }
  }, [project]);

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      writeContract({
        abi: contract.abi as any,
        address: project.contractAddress,
        functionName: 'withdrawFunds',
        args: [parseEther(formData.value), formData.message],
      });
    } catch (error) {
      toast.error('Failed to send donation', { description: error.message });
    }
  };

  const onClose = () => {
    const modal: any = document.getElementById('withdraw-modal');
    modal.close();
  };

  return (
    <dialog id="withdraw-modal" className="modal">
      <div className="modal-box">
        <h3 className="mb-4 font-bold text-lg">Withdraw Fund</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label" htmlFor="address">
              <span className="label-text">Destination Address</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input input-bordered w-full"
              required={true}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="value">
              <span className="label-text">Amount (ETH)</span>
            </label>
            <input
              type="number"
              step="0.000001"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="input input-bordered w-full"
              required={true}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="message">
              <span className="label-text">Message</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-info" disabled={isPending}>
              {isPending ? 'Confirming...' : 'Withdraw'}
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-2 truncate pt-2 text-sm hover:text-clip">
          {hash && !isConfirmed && (
            <div role="alert" className="alert alert-info p-2">
              <Info />
              <span>Transaction Hash:</span>
              <span>
                <Link target="_blank" href={`https://sepolia.basescan.org/tx/${hash}`}>
                  {hash}
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
    </dialog>
  );
}
