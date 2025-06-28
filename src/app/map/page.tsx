'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
});
import ComparisonModal from './ComparisonModal';
import { DatabaseService } from '../../lib/supabase';
import { Project } from '@/types';

const MapPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    viewMode: 'map',
    layers: { projects: true, clusters: true, heatmap: false, municipalities: false, roads: false, population: false },
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project);
  };

  const handleAddToComparison = (project: any) => {
    if (selectedForComparison.length < 3 && !selectedForComparison.find(p => p.id === project.id)) {
      setSelectedForComparison([...selectedForComparison, project]);
    }
  };

  const handleRemoveFromComparison = (projectId: number) => {
    setSelectedForComparison(selectedForComparison.filter(p => p.id !== projectId));
  };

  const handleCompare = () => {
    if (selectedForComparison.length > 1) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white p-6 overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Filtros</h2>
        {/* Add filter controls here */}
        
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Capas del Mapa</h3>
          {Object.keys(filters.layers).map(layer => (
            <div key={layer} className="flex items-center justify-between mb-2">
              <label htmlFor={layer}>{layer.charAt(0).toUpperCase() + layer.slice(1)}</label>
              <input
                type="checkbox"
                id={layer}
                checked={(filters.layers as any)[layer]}
                onChange={e => setFilters({ ...filters, layers: { ...filters.layers, [layer]: e.target.checked } })}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-4">Modo de Vista</h3>
          <select 
            value={filters.viewMode} 
            onChange={e => setFilters({ ...filters, viewMode: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="map">Mapa</option>
            <option value="satellite">Satélite</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>

        <div className="mt-8">
          <button 
            onClick={() => setCompareMode(!compareMode)}
            className={`w-full p-2 rounded ${compareMode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {compareMode ? 'Salir del Modo Comparación' : 'Activar Modo Comparación'}
          </button>
          {compareMode && (
            <button 
              onClick={handleCompare}
              className="w-full p-2 mt-4 bg-green-500 text-white rounded"
              disabled={selectedForComparison.length < 2}
            >
              Comparar ({selectedForComparison.length})
            </button>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 h-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <svg className="animate-spin h-12 w-12 text-lime-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <MapComponent 
            projects={projects.map(p => ({
              ...p,
              coordinates: [p.coordinates?.y, p.coordinates?.x], // Convert to [lat, lng]
              score: p.mcda_score,
              assetClass: p.asset_class,
              address: p.location,
              color: '#84cc16', // Default color, can be dynamic
              units: p.units_count,
              floors: p.floors_count,
              area: p.area_total,
              budget: p.budget,
            }))}
            filters={filters}
            onProjectSelect={handleProjectSelect}
            compareMode={compareMode}
            onAddToComparison={handleAddToComparison}
            selectedForComparison={selectedForComparison}
          />
        )}
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <ComparisonModal 
          projects={selectedForComparison}
          onClose={() => setIsModalOpen(false)}
          onRemoveProject={handleRemoveFromComparison}
        />
      )}
    </div>
  );
};

export default MapPage;