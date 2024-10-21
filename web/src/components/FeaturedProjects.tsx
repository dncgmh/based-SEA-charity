'use client';

import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from 'src/lib/api';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      const { data: fetchedProjects } = await api.project.getFeatured();
      if (fetchedProjects.length < 6) {
        fetchedProjects.splice(3, 3);
      }
      setProjects(fetchedProjects);
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-blue-50">
      <div className="container">
        <section className="p-8">
          <h2 className="divider mb-6 text-center font-bold text-3xl">Featured Projects</h2>
          <div className="flex justify-end py-2">
            <Link href="/project">
              <button className="btn btn-xs btn-info btn-outline">See More</button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <ProjectCard project={project} key={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
