'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSetting } from '@/hooks/use-setting';
import { getRemainingDate } from '@/lib/common';

export default function ProjectCard({ project }) {
  const { setting } = useSetting();
  const totalFundsRaised = project.stats?.totalDonated;
  const targetAmount = project.targetAmount;

  const totalFundsRaisedValue = totalFundsRaised * setting.etherPrice;

  const progressPercentage = (totalFundsRaisedValue / project.targetAmount) * 100;
  const remainingFunds = targetAmount - totalFundsRaisedValue;

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="relative">
        <Image src={project?.images?.[0]} alt={project.title} width={400} height={300} className="h-56 object-cover" />
        <div className="absolute bottom-2 left-2 flex items-center space-x-2 rounded-lg bg-base-100 bg-opacity-80 p-2">
          <div className="avatar w-10">
            <div className="w-full rounded-full ring ring-sky ring-offset-1 ring-offset-base-100">
              <Image
                src={project.charity.logo}
                alt={project.charity.name}
                width={50}
                height={50}
                className="object-cover"
              />
            </div>
          </div>
          <span className="font-semibold text-sm">{project.charity.name}</span>
        </div>
        <div className="absolute top-2 right-2 rounded-full bg-info px-2 py-1 font-bold text-info-content text-xs">
          {getRemainingDate(project.endDate)}
        </div>
      </figure>
      <div className="card-body p-4">
        <div className="tooltip text-left" data-tip={project.title}>
          <h2 className="card-title line-clamp-1 text-lg">{project.title}</h2>
        </div>
        <progress className="progress progress-info w-full" value={progressPercentage} max="100" />
        <div className="flex justify-between text-sm">
          <span>{progressPercentage.toFixed(1)}% funded</span>
          <span>${remainingFunds.toLocaleString()} to go</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-sm">{project.stats?.donationCount} donors</span>
          <Link href={`/project/${project.slug}`}>
            <button className="btn btn-info btn-sm">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
