'use client';

import React, { useState } from 'react';
import MapComponent from './MapComponent';
import ComparisonModal from './ComparisonModal';

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: 'Torre Reforma Norte',
    address: 'Ciudad de Guatemala',
    assetClass: 'Residencial',
    score: 8.7,
    color: '#34D399',
    coordinates: [14.6349, -90.5069],
    budget: 25000000,
    area: 12500,
    units: 120,
    floors: 25,
    developer: 'Desarrollos Inmobiliarios S.A.',
    completionDate: '2025-12-31',
    status: 'Activo',
    location: 'Zona 10'
  },
  {
    id: 2,
    name: 'Centro Comercial Pradera',
    address: 'Escuintla',
    assetClass: 'Comercial',
    score: 7.9,
    color: '#60A5FA',
    coordinates: [14.3050, -90.7856],
    budget: 18000000,
    area: 8500,
    units: 45,
    floors: 3,
    developer: 'Grupo Pradera',
    completionDate: '2024-08-15',
    status: 'En Desarrollo',
    location: 'Escuintla Centro'
  },
  // Add more mock projects as needed
];

const MapPage = () => {
  const [filters, setFilters] = useState({
    viewMode: 'map',
    layers: { projects: true, clusters: true, heatmap: false, municipalities: false, roads: false, population: false },
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <MapComponent 
          projects={mockProjects}
          filters={filters}
          onProjectSelect={handleProjectSelect}
          compareMode={compareMode}
          onAddToComparison={handleAddToComparison}
          selectedForComparison={selectedForComparison}
        />
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
