'use client';

import { Coins, Facebook, Globe, Instagram, Mail, MapPin, Phone, User, Youtube } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { useSetting } from '@/hooks/use-setting';

const QuickStats = ({ charity }) => {
  const { setting } = useSetting();

  if (!charity.stats) {
    return <></>;
  }
  const totalFundsRaised = charity.stats.totalDonated * setting.etherPrice;
  return (
    <div className="">
      <div>
        <div className="badge badge-outline badge-lg flex items-center gap-2 text-xs">
          <Coins size={16} />
          <span className="font-semibold">Raised:</span>
          <span>${totalFundsRaised}</span>
        </div>
        <div className="badge badge-outline badge-lg mt-2 flex items-center gap-2 text-xs">
          <User size={16} />
          <span className="font-semibold">Donors:</span>
          <span>{charity.stats.donationCount}</span>
        </div>
      </div>
    </div>
  );
};

export default async function CharityDetailPage({ params }: { params: { slug: string } }) {
  const [charity, setCharity] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      const charityData = await api.charity.getBySlug(params.slug);
      if (!charityData?.data) {
        return;
      }
      setCharity(charityData.data);
      const projectsData = await api.project.getList({
        charityId: charityData.data._id,
      });
      setProjects(projectsData.data);
    })();
  }, [params.slug]);

  const getLinkIcon = (type) => {
    switch (type) {
      case 'website':
        return <Globe size={20} />;
      case 'facebook':
        return <Facebook size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      default:
        return <Globe size={20} />;
    }
  };

  if (!charity) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 overflow-hidden rounded-lg bg-base-100 shadow-xl">
        <div className="p-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-6">
              <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-lg ring ring-sky-300 ring-offset-2">
                <Image src={charity.logo} alt={charity.name} layout="fill" objectFit="cover" />
              </div>
              <div>
                <h1 className="font-bold text-3xl">{charity.name}</h1>
                <p className="text-base-content/70">{charity.type}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-4 font-semibold text-2xl">About Us</h2>
              <div className="space-y-4 whitespace-pre-line text-base-content/80">{charity.description}</div>
            </div>

            <div>
              <h2 className="mb-4 font-semibold text-2xl">Contact Information</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-info" />
                  <span>{charity.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-info" />
                  <span>{charity.phoneNumber}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-info" />
                  <span>{charity.email}</span>
                </div>
              </div>

              <h3 className="mt-6 mb-2 font-semibold text-xl">Connect with us</h3>
              <div className="flex flex-wrap gap-2">
                {charity?.links?.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    {getLinkIcon(link.type)}
                    <span className="ml-2">{link.type}</span>
                  </a>
                ))}
              </div>
              <h3 className="mt-6 mb-2 font-semibold text-xl">Stats</h3>

              <QuickStats charity={charity} />
            </div>
          </div>
        </div>
      </div>

      <h3 className="mt-8 mb-4 font-bold text-2xl">Projects</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard project={project} key={index} />
        ))}
      </div>
    </div>
  );
}
