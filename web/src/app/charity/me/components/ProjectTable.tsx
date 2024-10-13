import Image from 'next/image';
import { Edit, LifeBuoy, Plus, ReceiptText, ArrowDownToLine } from 'lucide-react';
import UpdateProjectModal from '@/app/charity/me/components/UpdateProjectModal';
import OpenDonationsModal from '@/app/charity/me/components/OpenDonations';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import CreateProjectModal from '@/app/charity/me/components/CreateProjectModal';
import { shortenAddress } from '@/lib/common';
import Link from 'next/link';
import { baseSepolia } from 'viem/chains';
import ProjectTableStats from '@/app/charity/me/components/ProjectStatsTable';
import WithdrawModal from '@/app/charity/me/components/WithdrawModal';

const ProjectsTable = () => {
  const [editingProject, setEditingProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const { auth } = useAuth();
  const explorerUrl = baseSepolia.blockExplorers.default.url;

  useEffect(() => {
    (async () => {
      const result = await api.project.getOfCharity({});
      setProjects(result.data);
    })();
  }, [auth.charityId]);

  const onCreateProject = (project) => {
    setProjects([...projects, project]);
  };

  const handleUpdateProject = async (updatedData) => {
    try {
      setProjects(projects.map((p) => (p._id === updatedData._id ? updatedData : p)));
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const showModal = (type) => {
    const element: any = document.getElementById(type);
    element.showModal();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-2xl">Projects</h3>
        <button className="btn btn-info" onClick={() => showModal('create-project')}>
          <Plus className="mr-2 h-4 w-4" /> Create New Project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-zebra table w-full">
          <thead>
            <tr>
              <th className="w-1/12">Image</th>
              <th className="w-1/6">Title</th>
              <th>Contract Address</th>
              <th>Date Range</th>
              <th>Details</th>
              <th className="w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    width={100}
                    height={75}
                    className="rounded object-cover"
                  />
                </td>
                <td>
                  <Link className="link" href={`/project/${project.slug}`}>
                    {project.title}
                  </Link>
                </td>
                <td className="font-mono">
                  {project.contractAddress && (
                    <Link href={`${explorerUrl}/address/${project.contractAddress}`} target="_blank">
                      <button className="btn btn-outline btn-xs">
                        <ReceiptText size={12} />
                        {shortenAddress(project.contractAddress)}
                      </button>
                    </Link>
                  )}
                </td>
                <td>
                  <div>{new Date(project.startDate).toLocaleDateString()}</div>
                  <div>{new Date(project.endDate).toLocaleDateString()}</div>
                </td>
                <td>
                  <ProjectTableStats project={project} />
                </td>
                <td className="space-y-2">
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => {
                      setEditingProject(project);
                      showModal('update-project');
                    }}
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    className="btn btn-outline btn-sm w-full"
                    disabled={project.contractAddress}
                    onClick={() => {
                      setEditingProject(project);
                      showModal('open-donations');
                    }}
                  >
                    <LifeBuoy size={12} /> Open Donations
                  </button>
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => {
                      setEditingProject(project);
                      showModal('withdraw-modal');
                    }}
                    disabled={project.currentBalance <= 0}
                  >
                    <ArrowDownToLine size={12} /> Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateProjectModal onCreate={onCreateProject} />
      <UpdateProjectModal project={editingProject} onUpdate={handleUpdateProject} />
      <OpenDonationsModal project={editingProject} onProjectUpdate={handleUpdateProject} />
      <WithdrawModal project={editingProject} />
    </div>
  );
};

export default ProjectsTable;
