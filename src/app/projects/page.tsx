'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DatabaseService } from '../../lib/supabase';
import { Project } from '@/types';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await DatabaseService.getProjects();
        setProjects(data as Project[]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container-urbop py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Proyectos</h1>
        <Link href="/projects/new" className="btn btn-primary">
          Nuevo Proyecto
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-xl"></div>
              <div className="card-body">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="card cursor-pointer">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{project.name}</h2>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </div>
                  </div>
                  <p className="text-gray-600">{project.location}</p>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-gray-500">{project.asset_class}</span>
                    <span className="text-lg font-bold text-lime-600">{project.mcda_score?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;