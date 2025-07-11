'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
});
import ComparisonModal from './ComparisonModal';
import { DatabaseService } from '../../lib/supabase';
import { Project } from '@/types';

// Helper function to parse Supabase POINT type to [lat, lng]
const parseSupabasePoint = (point: any): [number, number] | undefined => {
  if (!point) return undefined;

  // Handle string format like "(lon,lat)"
  if (typeof point === 'string') {
    const match = point.match(/\(([^,]+),([^)]+)\)/);
    if (match) {
      const lon = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lon)) {
        return [lat, lon];
      }
    }
  }
  // Handle object format like { x: lon, y: lat }
  else if (typeof point === 'object' && point !== null && typeof point.x === 'number' && typeof point.y === 'number') {
    return [point.y, point.x]; // Leaflet expects [lat, lng]
  }

  return undefined;
};

const MapPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    viewMode: 'map',
    layers: { projects: true, clusters: true, heatmap: false, municipalities: false, roads: false, population: false },
    assetClass: '', // New filter state
    developmentCategory: '', // New filter state
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await DatabaseService.getProjects(filters.assetClass, filters.developmentCategory);
        setProjects(data as Project[]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters.assetClass, filters.developmentCategory]); // Add new filters to dependency array

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
        
        <div className="mb-4">
          <label htmlFor="assetClassFilter" className="block text-sm font-medium text-gray-700 mb-1">Clase de Activo</label>
          <select
            id="assetClassFilter"
            value={filters.assetClass}
            onChange={e => setFilters({ ...filters, assetClass: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Todas</option>
            <option value="residential">Residencial</option>
            <option value="commercial">Comercial</option>
            <option value="mixed_use">Uso Mixto</option>
            <option value="industrial">Industrial</option>
            <option value="office">Oficina</option>
            <option value="retail">Minorista</option>
            <option value="hospitality">Hostelería</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="developmentCategoryFilter" className="block text-sm font-medium text-gray-700 mb-1">Categoría de Desarrollo</label>
          <select
            id="developmentCategoryFilter"
            value={filters.developmentCategory}
            onChange={e => setFilters({ ...filters, developmentCategory: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Todas</option>
            <option value="land_development">Desarrollo de Suelo</option>
            <option value="land_packaging">Empaquetado de Suelo</option>
            <option value="land_banking">Banco de Tierras</option>
            <option value="real_estate_development">Desarrollo Inmobiliario</option>
            <option value="real_estate_operator">Operador Inmobiliario</option>
          </select>
        </div>
        
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
              coordinates: p.coordinates ? [p.coordinates.y, p.coordinates.x] : undefined, // Map to [lat, lng] for Leaflet
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
