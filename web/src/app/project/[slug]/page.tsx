'use client';

import { useState, useEffect } from 'react';
import { Clock, Tag, Users } from 'lucide-react';
import Image from 'next/image';
import DonateCollapse from '@/app/project/[slug]/components/DonateCollapse';
import { api } from '@/lib/api';
import TransactionList from '@/app/project/[slug]/components/TransactionList';
import { useBalance } from 'wagmi';
import Loading from '@/components/Loading';
import { useSetting } from '@/hooks/use-setting';
import { formatCurrency } from '@/lib/common';

export default function ProjectDetailPage({ params }) {
  const [project, setProject] = useState(null);
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setting } = useSetting();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await api.project.getBySlug(params.slug);
        setProject(projectData.data);
        const charityData = await api.charity.getById(projectData.data.charityId);
        setCharity(charityData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  const { data: balance } = useBalance({
    address: project?.contractAddress,
  });

  const totalFundsRaised = project?.stats?.totalDonated;
  const totalFundsRaisedValue = totalFundsRaised * setting.etherPrice;

  if (loading) {
    return <Loading />;
  }

  if (!project || !charity) {
    return <div>Project not found</div>;
  }

  const currentAmount = totalFundsRaisedValue;
  const goal = project.targetAmount;
  const progressPercentage = (currentAmount / goal) * 100;
  const formattedProgressPercentage = progressPercentage.toFixed(2);
  const remainingDays = Math.max(
    0,
    Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
  );

  return (
    <div className="container mx-auto animate-fadeIn p-4">
      <h1 className="mb-6 text-center font-bold text-4xl">{project.title}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="group relative">
            <Image
              src={project.images[0]}
              alt={project.title}
              width={800}
              height={600}
              className="h-[400px] w-full rounded-lg object-cover shadow-lg"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-4 bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="mb-4 flex items-center">
                <div className="avatar mr-4">
                  <div className="w-16 rounded-full ring ring-sky ring-offset-2 ring-offset-base-100">
                    <Image alt={charity.name} src={charity.logo} width={64} height={64} />
                  </div>
                </div>
                <div>
                  <h2 className="card-title">{charity.name}</h2>
                  <p className="text-gray-600 text-sm">Project Organizer</p>
                </div>
              </div>

              <h3 className="mb-2 font-semibold text-xl">Fundraising Progress</h3>
              <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2.5 rounded-full bg-blue-600 transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between font-medium text-sm">
                <span> {formatCurrency(totalFundsRaisedValue)} USD raised</span>
                <span>{formattedProgressPercentage}%</span>
              </div>
              <p className="mt-1 text-right text-gray-600 text-sm">
                of {formatCurrency(goal, { fractionDigits: 0 })} goal
              </p>

              <div className="mt-4 flex justify-between text-sm">
                <div className="flex items-center">
                  <Users size={18} className="mr-2 text-info" />
                  <span>{project?.stats?.donationCount || 0} donors</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-info" />
                  <span>{remainingDays} days left</span>
                </div>
              </div>
              <DonateCollapse project={project} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="relative">
          <div className="carousel carousel-center space-x-4 rounded-box">
            {project.images.map((image, index) => (
              <div key={index} className="carousel-item">
                <Image
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  width={150}
                  height={150}
                  className="rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-semibold text-2xl">About This Project</h2>
        <p className="whitespace-pre-line text-md">{project.description}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag, index) => (
          <div
            key={index}
            className="badge badge-outline cursor-pointer p-3 transition-all duration-300 hover:bg-info hover:text-white"
          >
            <Tag size={14} className="mr-2" />
            {tag}
          </div>
        ))}
      </div>

      <TransactionList projectId={project._id} />
    </div>
  );
}
