import { useEffect, useState } from 'react';
import Link from 'next/link';
import contractJson from '../../../../../../smart-contract/artifacts/contracts/ChairtyProjectDonation.sol/CharityProjectDonation.json';
import { type BaseError, useDeployContract, useWaitForTransactionReceipt } from 'wagmi';
import { CircleCheck, CircleX, Info, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function OpenDonationsModal({ project, onProjectUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    deployContract,
    data: hash,
    isPending,
    isSuccess: isDeploySuccess,
    error: deployError,
    reset: resetDeployContract,
  } = useDeployContract({});

  const {
    data: txData,
    isSuccess: isTxSuccess,
    isLoading: isDeploying,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const contractAddress = txData?.contractAddress;

  useEffect(() => {
    (async () => {
      try {
        if (!contractAddress) {
          return;
        }
        const formData = new FormData();
        formData.append('contractAddress', contractAddress);
        const result = await api.project.update(project._id, formData);
        onProjectUpdate(result.data);
      } catch (_error) {
        toast.error('Failed to update project');
      }
    })();
  }, [contractAddress]);

  const onClose = (e) => {
    e.preventDefault();
    const modal = document.getElementById('open-donations');
    modal.close();
    setIsOpen(false);
    resetState();
  };

  const onOpenDonations = async (e) => {
    e.preventDefault();
    setIsOpen(true);
    deployContract({
      abi: contractJson.abi,
      args: [project._id],
      bytecode: contractJson.bytecode,
    });
  };

  const resetState = () => {
    resetDeployContract();
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  return (
    <dialog id="open-donations" className="modal">
      <div className="modal-box">
        <h3 className="mb-4 font-bold text-lg">Open Donations</h3>
        <p className="py-4">
          Opening donations will deploy a smart contract. Please note that this will require gas fees.
        </p>
        <div className="flex flex-col gap-2 truncate pt-2 text-sm hover:text-clip">
          {hash && (
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
          {isDeploying && (
            <div role="alert" className="alert alert-info p-2">
              <Loader2 className="animate-spin" />
              Deploying contract...
            </div>
          )}
          {isTxSuccess && (
            <div role="alert" className="alert alert-success p-2">
              <CircleCheck />
              Contract deployed successfully. Address: {contractAddress}
            </div>
          )}
          {deployError && (
            <div role="alert" className="alert alert-error p-2">
              <CircleX />
              Error: {(deployError as BaseError).shortMessage || deployError.message}
            </div>
          )}
        </div>
        <div className="modal-action">
          <form method="dialog">
            {!isTxSuccess && (
              <button
                disabled={isPending || isDeploying}
                type="button"
                className="btn btn-sm h-full"
                onClick={onOpenDonations}
              >
                {isPending ? 'Confirming...' : isDeploying ? 'Deploying...' : 'Open Donations'}
              </button>
            )}
            <button type="button" className="btn btn-sm ml-2 h-full" onClick={onClose}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
