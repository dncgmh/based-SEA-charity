'use client';

import ProjectCard from '@/components/ProjectCard';
import { useState, useEffect } from 'react';
import { api } from 'src/lib/api';
import Pagination from 'rc-pagination';
import Loading from '@/components/Loading';

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 9;

  const loadProjects = async (page) => {
    setLoading(true);
    try {
      const { data: newProjects, meta } = await api.project.getList({
        status: activeTab,
        page,
        pageSize,
      });
      setProjects(newProjects);
      setTotalItems(meta.total);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(currentPage);
  }, [activeTab, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">

        <div className="tabs tabs-boxed mb-6 justify-center">
          <button
            className={`tab ${activeTab === 'ongoing' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('ongoing')}
          >
            Ongoing Projects
          </button>
          <button
            className={`tab ${activeTab === 'ended' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('ended')}
          >
            Ended Projects
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {loading && <Loading />}

        {!loading && projects.length === 0 && <p className="mt-8 text-center text-lg">No projects to display.</p>}

        {totalItems > pageSize && (
          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
              className="flex items-center"
              itemRender={(page, type, element) => {
                if (type === 'page') {
                  return (
                    <button
                      className={`mx-1 rounded px-3 py-1 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                    >
                      {page}
                    </button>
                  );
                }
                if (type === 'prev' || type === 'next') {
                  return (
                    <button className="mx-1 rounded bg-white px-3 py-1 text-blue-500">
                      {type === 'prev' ? '&lt;' : '&gt;'}
                    </button>
                  );
                }
                return element;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
