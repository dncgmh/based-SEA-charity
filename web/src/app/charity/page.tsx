'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from 'src/lib/api';

const CharityCard = ({ charity }) => (
  <div className="card bg-base-100 shadow-xl">
    <figure className="px-4 pt-4 pb-2">
      <div className="avatar">
        <div className="w-16 rounded-full ring ring-sky ring-offset-2 ring-offset-base-100">
          <Image src={charity.logo} alt={charity.name} width={64} height={64} />
        </div>
      </div>
    </figure>
    <div className="card-body items-center pt-4 text-center">
      <h3 className="card-title">{charity.name}</h3>
      <p className="line-clamp-2 text-sm">{charity.description}</p>
      <div className="card-actions">
        <Link href={`/charity/${charity.slug}`}>
          <button className="btn btn-info btn-sm">Learn More</button>
        </Link>
      </div>
    </div>
  </div>
);

export default function Charities() {
  const [activeTab, setActiveTab] = useState('individual');
  const [charities, setCharities] = useState({ individual: [], organization: [] });

  useEffect(() => {
    const fetchCharities = async () => {
      const { data: individualCharities } = await api.charity.getList({ type: 'individual' });
      const { data: organizationCharities } = await api.charity.getList({ type: 'organization' });
      setCharities({ individual: individualCharities, organization: organizationCharities });
    };
    fetchCharities();
  }, []);

  return (
    <div className="bg-base-200 p-4">
      <div className="container mx-auto">
        <div className="tabs tabs-boxed mb-4 justify-center">
          <a
            className={`tab ${activeTab === 'individual' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('individual')}
          >
            Individual
          </a>
          <a
            className={`tab ${activeTab === 'organization' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('organization')}
          >
            Organization
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {charities[activeTab].slice(0, 6).map((charity, index) => (
            <CharityCard key={index} charity={charity} />
          ))}
        </div>

        {/* <div className='flex justify-center mt-6'>
          <Link href='/charity'>
            <button className='btn btn-secondary'>See More</button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
