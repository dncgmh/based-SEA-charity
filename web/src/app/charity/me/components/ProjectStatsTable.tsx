import { useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { useSetting } from '@/hooks/use-setting';
import { formatCurrency } from '@/lib/common';

export default function ProjectTableStats({ project }) {
  const { setting } = useSetting();
  const { data: balanceResult } = useBalance({
    address: project?.contractAddress,
  });
  const totalFundsRaised = (project?.stats?.totalDonated || 0) * setting.etherPrice;

  const balance = balanceResult?.value ? Number.parseFloat(formatEther(balanceResult.value)) : 0;
  const balanceValue = balance * setting.etherPrice;

  return (
    <ul>
      <li>
        <span className='font-bold'>Target Amount:</span> {formatCurrency(project.targetAmount)}
      </li>
      <li>
        <span className='font-bold'>Raised:</span> {formatCurrency(totalFundsRaised)}
      </li>
      <li>
        <span className='font-bold'>Donors:</span> {project?.stats?.donationCount}
      </li>
      <li>
        <span className='font-bold'>Contract Balance:</span> {formatCurrency(balanceValue)}
      </li>
    </ul>
  );
}
