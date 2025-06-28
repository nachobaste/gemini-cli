'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase'; // Adjust path as needed

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, mcda_evaluations(*, mcda_parameters(*)), business_model_canvas(*))')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
      } else {
        setProject(data);
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'under_review': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-black py-16">
        <div className="container-urbop">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-12 w-12 text-lime-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <Link href="/projects" className="text-gray-400 hover:text-lime-500 flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Volver a Proyectos
                  </Link>
                  <h1 className="mb-2">{project.name}</h1>
                  <div className="flex items-center text-gray-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{project.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)} text-white`}>
                    {project.status}
                  </span>
                  {/* Add MCDA score here when available */}
                </div>
              </div>
              
              <div className="accent-line"></div>
              
              <p className="text-xl text-gray-300 mt-6">
                {project.description}
              </p>
              
              {/* Tabs */}
              <div className="flex flex-wrap border-b border-gray-800 mt-12">
                <button
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Resumen
                </button>
                <button
                  className={`tab ${activeTab === 'location' ? 'active' : ''}`}
                  onClick={() => setActiveTab('location')}
                >
                  Ubicación
                </button>
                <button
                  className={`tab ${activeTab === 'mcda' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mcda')}
                >
                  Análisis MCDA
                </button>
                <button
                  className={`tab ${activeTab === 'bmc' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bmc')}
                >
                  Business Model Canvas
                </button>
                <button
                  className={`tab ${activeTab === 'financial' ? 'active' : ''}`}
                  onClick={() => setActiveTab('financial')}
                >
                  Análisis Financiero
                </button>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Tab Content */}
      {!loading && project && (
        <section className="bg-gray-900 py-12">
          <div className="container-urbop">
            {/* Render tab content based on activeTab */}
            {activeTab === 'overview' && <div>Overview Content</div>}
            {activeTab === 'location' && <div>Location Content</div>}
            {activeTab === 'mcda' && <div>MCDA Content</div>}
            {activeTab === 'bmc' && <div>BMC Content</div>}
            {activeTab === 'financial' && <div>Financial Content</div>}
          </div>
        </section>
      )}
    </div>
  );
}
