import React from 'react';
import Link from 'next/link';
import { Project, ProjectStatus, AssetClass } from '@/types';
import { DatabaseService } from '../../lib/supabase'; // Import DatabaseService

interface KanbanViewProps {
  projects: Project[];
  groupBy: 'status' | 'asset_class';
  onProjectUpdated: (updatedProject: Project) => void; // Callback for when a project is updated
}

const KanbanView: React.FC<KanbanViewProps> = ({ projects, groupBy, onProjectUpdated }) => {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'planning':
        return 'bg-blue-500';
      case 'under_review':
        return 'bg-yellow-500';
      case 'suspended':
        return 'bg-red-500';
      case 'completed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAssetClassLabel = (assetClass: AssetClass) => {
    switch (assetClass) {
      case 'residential': return 'Residencial';
      case 'commercial': return 'Comercial';
      case 'mixed_use': return 'Uso Mixto';
      case 'industrial': return 'Industrial';
      case 'office': return 'Oficina';
      case 'retail': return 'Minorista';
      case 'hospitality': return 'Hostelería';
      default: return assetClass;
    }
  };

  const getGroupLabels = () => {
    if (groupBy === 'status') {
      return [
        'planning', 'active', 'under_review', 'suspended', 'completed'
      ] as ProjectStatus[];
    } else {
      return [
        'residential', 'commercial', 'mixed_use', 'industrial', 'office', 'retail', 'hospitality'
      ] as AssetClass[];
    }
  };

  const groupedProjects = projects.reduce((acc, project) => {
    const key = project[groupBy];
    if (key) {
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(project);
    }
    return acc;
  }, {} as Record<string, Project[]>);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, project: Project) => {
    e.dataTransfer.setData('projectId', project.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetGroup: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('projectId');
    const projectToUpdate = projects.find(p => p.id === projectId);

    if (projectToUpdate) {
      let updatedProject: Partial<Project>;
      if (groupBy === 'status') {
        updatedProject = { status: targetGroup as ProjectStatus };
      } else {
        updatedProject = { asset_class: targetGroup as AssetClass };
      }

      try {
        const result = await DatabaseService.updateProject(projectId, updatedProject);
        onProjectUpdated(result); // Notify parent component of the update
      } catch (error) {
        console.error('Error updating project:', error);
        // Optionally, revert UI changes or show an error message
      }
    }
  };

  return (
    <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
      {getGroupLabels().map((groupKey) => (
        <div 
          key={groupKey} 
          className="flex-shrink-0 w-80 bg-gray-800 rounded-lg shadow-md mr-4 p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, groupKey)}
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
            {groupBy === 'status' ? groupKey.charAt(0).toUpperCase() + groupKey.slice(1).replace('_', ' ') : getAssetClassLabel(groupKey as AssetClass)}
          </h3>
          <div className="space-y-3">
            {groupedProjects[groupKey]?.map((project) => (
              <Link 
                href={`/projects/${project.id}`} 
                key={project.id} 
                className="block bg-gray-700 p-3 rounded-md shadow-sm hover:bg-gray-600 transition-colors duration-200"
                draggable
                onDragStart={(e) => handleDragStart(e, project)}
              >
                <h4 className="font-medium text-white text-md mb-1">{project.name}</h4>
                <p className="text-gray-400 text-sm mb-2">{project.location}</p>
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  {project.mcda_score !== null && project.mcda_score !== undefined ? (
                    <span className="text-lime-400 text-sm font-bold">{project.mcda_score.toFixed(1)}</span>
                  ) : (
                    <span className="text-gray-400 text-sm font-bold">N/A</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;