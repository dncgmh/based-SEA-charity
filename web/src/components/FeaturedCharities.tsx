'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from 'src/lib/api';

export default function FeaturedCharities() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: fetchedCharities } = await api.charity.getFeatured();
      setCharities(fetchedCharities.slice(0, 3));
    };
    fetchData();
  }, []);

  return (
    <div className="bg-sky-50">
      <div className="container">
        <section className="p-8">
          <h2 className="divider mb-6 text-center font-bold text-3xl">Featured Charities</h2>
          <div className="flex justify-end py-2">
            <Link href="/charity">
              <button className="btn btn-xs btn-info btn-outline">See More</button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {charities.map((charity, index) => (
              <div key={index} className="card bg-base-200 shadow-xl">
                <figure className="px-2 py-4">
                  <div className="avatar">
                    <div className="w-20 rounded-full ring ring-sky ring-offset-2 ring-offset-base-100">
                      <Image src={charity.logo} alt={charity.name} width={60} height={60} className="rounded-xl" />
                    </div>
                  </div>
                </figure>
                <div className="card-body items-center px-8 pt-0 pb-4 text-center">
                  <h3 className="card-title">{charity.name}</h3>
                  <p className="line-clamp-3 text-left text-sm">{charity.description}</p>
                  <div className="card-actions">
                    <Link href={`/charity/${charity.slug}`}>
                      <button className="btn btn-ghost">Learn More</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
