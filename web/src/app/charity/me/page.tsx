'use client';

import { Facebook, Instagram, Youtube, Edit, Globe } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import UpdateCharityModal from './components/UpdateCharityModal';
import { useAuth } from '@/hooks/use-auth';
import ProjectsTable from '@/app/charity/me/components/ProjectTable';
import Loading from '@/components/Loading';

export default function CharityOwnerPage() {
  const [charity, setCharity] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const charityId = auth.charityId;
    (async () => {
      if (!charityId) {
        return;
      }
      const result = await api.charity.getById(charityId);
      setCharity(result.data);
    })();
  }, [auth.charityId]);

  const showModal = (type) => {
    const element: any = document.getElementById(type);
    element.showModal();
  };

  const handleUpdateCharity = async (updatedData) => {
    setCharity(updatedData);
  };

  if (!charity) {
    return <Loading />;
  }

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

  return (
    <div className='container mx-auto p-4'>
      <div className='card mb-8 bg-base-100 shadow-xl'>
        <div className='card-body'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='card-title text-3xl'>{charity.name}</h2>
            <button className='btn btn-info' onClick={() => showModal('update-charity')}>
              <Edit className='mr-2 h-4 w-4' /> Edit Charity Details
            </button>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div>
              <figure>
                <Image src={charity.logo} alt={charity.name} width={200} height={200} className='w-full rounded-xl' />
              </figure>
            </div>
            <div className='md:col-span-3'>
              <p className='mb-2' style={{ whiteSpace: 'pre-line' }}>
                {charity.description}
              </p>
              <p className='mb-2'>
                <strong>Address:</strong> {charity.address}
              </p>
              <p className='mb-2'>
                <strong>Phone Number:</strong> {charity.phoneNumber}
              </p>
              <div className='mt-4 flex flex-wrap gap-2'>
                {charity.links.map((link, index) => (
                  <a key={index} href={link.url} target='_blank' rel='noopener noreferrer' className='btn btn-circle btn-outline'>
                    {getLinkIcon(link.type)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProjectsTable />

      <UpdateCharityModal charity={charity} onUpdate={handleUpdateCharity} />
    </div>
  );
}
