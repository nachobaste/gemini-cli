'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Project, ProjectStatus, AssetClass } from '@/types';
import { DatabaseService } from '../../lib/supabase';

interface KanbanViewProps {
  projects: Project[];
  groupBy: 'status' | 'asset_class';
  onProjectUpdated: () => void; // Callback to refresh projects in parent
}

const KanbanView: React.FC<KanbanViewProps> = ({ projects: initialProjects, groupBy, onProjectUpdated }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [assignedTeamMember, setAssignedTeamMember] = useState('');

  // Dummy data for team members and comments for now
  const teamMembers = ['Alice', 'Bob', 'Charlie', 'David'];

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const getStatusColor = (score: number | undefined) => {
    if (score === undefined || score === null) return 'bg-gray-400';
    if (score > 7.5) return 'bg-green-500';
    if (score >= 6.0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, project: Project) => {
    e.dataTransfer.setData('projectId', project.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: ProjectStatus) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('projectId');
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, status: newStatus } : project
    );
    setProjects(updatedProjects);

    // Update in database
    try {
      await DatabaseService.updateProject(projectId, { status: newStatus });
      onProjectUpdated(); // Notify parent to re-fetch projects
    } catch (error) {
      console.error('Error updating project status:', error);
      // Revert UI if update fails
      setProjects(initialProjects);
    }
  };

  const handleQuickAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('projectName') as string;
    const location = formData.get('projectLocation') as string;
    const size = parseFloat(formData.get('projectSize') as string);

    // Placeholder for initial score generation
    const geocuboScore = parseFloat((Math.random() * 10).toFixed(1));

    const newProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
      name,
      location,
      asset_class: 'Unknown' as AssetClass, // Default for quick add
      status: 'planning', // Default status for new opportunities
      mcda_score: geocuboScore,
      // Add other required fields with default/placeholder values
      coordinates: { x: 0, y: 0 }, // Placeholder
      budget: 0,
      area_total: size,
      units_count: 0,
      floors_count: 0,
    };

    try {
      const createdProject = await DatabaseService.createProject(newProject);
      setProjects(prev => [...prev, createdProject]);
      onProjectUpdated(); // Notify parent to re-fetch projects
      setIsQuickAddModalOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding new project:', error);
    }
  };

  const openDetailModal = (project: Project) => {
    setSelectedProject(project);
    setAssignedTeamMember(project.created_by || 'Unassigned'); // Assuming created_by is assigned team member
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProject(null);
    setNewComment('');
  };

  const handlePostComment = () => {
    if (selectedProject && newComment.trim()) {
      // This would ideally update a comments collection in the database
      // For now, just update local state (not persistent)
      const updatedProject = {
        ...selectedProject,
        comments: [...(selectedProject.comments || []), {
          author: 'Current User', // Placeholder
          text: newComment.trim(),
          timestamp: new Date().toLocaleString()
        }]
      };
      setSelectedProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setNewComment('');
    }
  };

  const handleAssignTeamMember = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedProject) {
      const newAssignee = e.target.value;
      setAssignedTeamMember(newAssignee);
      const updatedProject = { ...selectedProject, created_by: newAssignee }; // Assuming created_by is assigned team member
      setSelectedProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));

      try {
        await DatabaseService.updateProject(selectedProject.id, { created_by: newAssignee });
        onProjectUpdated();
      } catch (error) {
        console.error('Error assigning team member:', error);
      }
    }
  };

  const getGroupedProjects = useCallback(() => {
    const grouped: { [key: string]: Project[] } = {};
    projects.forEach(project => {
      const key = groupBy === 'status' ? project.status : project.asset_class;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(project);
    });
    return grouped;
  }, [projects, groupBy]);

  const columns = groupBy === 'status'
    ? ['planning', 'active', 'under_review', 'suspended', 'completed']
    : [...new Set(projects.map(p => p.asset_class))].sort(); // Dynamic asset class columns

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div id="kanban-board" className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        {columns.map(columnKey => (
          <div
            key={columnKey}
            className="kanban-column bg-gray-200 rounded-lg p-3 shadow-md"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnKey as ProjectStatus)}
          >
            <h2 className="text-lg font-semibold mb-3 flex justify-between items-center">
              {columnKey.replace(/_/g, ' ').toUpperCase()}
              {columnKey === 'planning' && ( // Only show quick add for 'planning' column
                <button
                  className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xl leading-none"
                  onClick={() => setIsQuickAddModalOpen(true)}
                >+</button>
              )}
            </h2>
            <div className="kanban-cards space-y-3 min-h-[100px]">
              {getGroupedProjects()[columnKey]?.map(project => (
                <div
                  key={project.id}
                  className="kanban-card bg-white p-4 rounded-lg shadow-md cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, project)}
                  onClick={() => openDetailModal(project)}
                >
                  <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.asset_class} | {project.location}</p>
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-full ${getStatusColor(project.mcda_score)} flex items-center justify-center text-white font-bold text-sm`}>
                      {project.mcda_score !== undefined && project.mcda_score !== null ? project.mcda_score.toFixed(1) : 'N/A'}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm">
                      {project.created_by ? project.created_by.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Modal */}
      {isQuickAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Add New Opportunity</h3>
            <form onSubmit={handleQuickAddSubmit}>
              <div className="mb-4">
                <label htmlFor="projectName" className="block text-gray-700 text-sm font-bold mb-2">Project Name:</label>
                <input type="text" id="projectName" name="projectName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div className="mb-4">
                <label htmlFor="projectLocation" className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
                <input type="text" id="projectLocation" name="projectLocation" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div className="mb-4">
                <label htmlFor="projectSize" className="block text-gray-700 text-sm font-bold mb-2">Size (sqm):</label>
                <input type="number" id="projectSize" name="projectSize" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2" onClick={() => setIsQuickAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {isDetailModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">{selectedProject.name}</h3>
            <p className="text-gray-600 mb-2">{selectedProject.asset_class} | {selectedProject.location}</p>
            <p className="text-gray-600 mb-4">GEOCUBO Score: {selectedProject.mcda_score !== undefined && selectedProject.mcda_score !== null ? selectedProject.mcda_score.toFixed(1) : 'N/A'}</p>

            <div className="mb-4">
              <label htmlFor="assign-team-member" className="block text-gray-700 text-sm font-bold mb-2">Assign Team Member:</label>
              <select
                id="assign-team-member"
                className="p-2 border rounded-md w-full"
                value={assignedTeamMember}
                onChange={handleAssignTeamMember}
              >
                {teamMembers.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Comments:</h4>
              <div className="border p-3 rounded-md h-32 overflow-y-auto mb-3">
                {selectedProject.comments && selectedProject.comments.length > 0 ? (
                  selectedProject.comments.map((comment, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-100 rounded-md">
                      <p className="font-semibold text-sm">{comment.author} <span className="text-gray-500 text-xs">{comment.timestamp}</span></p>
                      <p className="text-gray-800">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
              <textarea
                id="new-comment"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={2}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2" onClick={handlePostComment}>Post Comment</button>
            </div>

            <div className="flex justify-end">
              <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md" onClick={closeDetailModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanView;
