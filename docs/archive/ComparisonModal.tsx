'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ComparisonModalProps {
  projects: any[];
  onClose: () => void;
  onRemoveProject: (projectId: number) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ projects, onClose, onRemoveProject }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (projects.length === 0) return null;

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-100';
    if (score >= 7.5) return 'text-lime-600 bg-lime-100';
    if (score >= 6.5) return 'text-yellow-600 bg-yellow-100';
    if (score >= 5.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Comparación de Proyectos</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            {[
              { key: 'overview', label: 'Resumen General' },
              { key: 'financial', label: 'Datos Financieros' },
              { key: 'technical', label: 'Especificaciones' },
              { key: 'location', label: 'Ubicación' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-lime-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Project Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-50 rounded-lg p-4 relative">
                <button
                  onClick={() => onRemoveProject(project.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex items-center mb-3">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: project.color }}
                  ></div>
                  <h3 className="font-bold text-gray-900 text-lg">{project.name}</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{project.assetClass}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(project.score)}`}>
                    {project.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Scores Comparison */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparación de Scores MCDA</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="text-center">
                      <div className="text-3xl font-bold mb-2" style={{ color: project.color }}>
                        {project.score}
                      </div>
                      <div className="text-sm text-gray-600">{project.name}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            backgroundColor: project.color,
                            width: `${(project.score / 10) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Comparison */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Estado de Proyectos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">{project.name}</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'Activo' ? 'bg-green-100 text-green-800' :
                        project.status === 'En Desarrollo' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              {/* Budget Comparison */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparación Financiera</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Proyecto</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Presupuesto</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Costo por m²</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Costo por Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: project.color }}
                              ></div>
                              {project.name}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{formatCurrency(project.budget)}</td>
                          <td className="py-3 px-4">${Math.round(project.budget / project.area).toLocaleString()}</td>
                          <td className="py-3 px-4">${Math.round(project.budget / project.units).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ROI Potential */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Potencial de Retorno</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => {
                    const roiScore = (project.score * 10).toFixed(1);
                    return (
                      <div key={project.id} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900 mb-2">{project.name}</div>
                        <div className="text-2xl font-bold mb-1" style={{ color: project.color }}>
                          {roiScore}%
                        </div>
                        <div className="text-sm text-gray-600">ROI Estimado</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-6">
              {/* Technical Specifications */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Proyecto</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Área Total</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Unidades</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Pisos</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Desarrollador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: project.color }}
                              ></div>
                              {project.name}
                            </div>
                          </td>
                          <td className="py-3 px-4">{project.area.toLocaleString()} m²</td>
                          <td className="py-3 px-4">{project.units}</td>
                          <td className="py-3 px-4">{project.floors}</td>
                          <td className="py-3 px-4 text-sm">{project.developer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Completion Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cronograma de Finalización</h4>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <span className="font-medium text-gray-900">{project.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {new Date(project.completionDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.ceil((new Date(project.completionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días restantes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6">
              {/* Location Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalles de Ubicación</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <h5 className="font-medium text-gray-900">{project.name}</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Dirección:</span>
                          <div className="font-medium">{project.address}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Coordenadas:</span>
                          <div className="font-mono text-xs">
                            {project.coordinates[0].toFixed(6)}, {project.coordinates[1].toFixed(6)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Zona:</span>
                          <div className="font-medium">{project.location}</div>
                        </div>
                      </div>
                      
                      <button className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm transition-colors">
                        Ver en Mapa
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distance Matrix */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Matriz de Distancias</h4>
                <div className="text-sm text-gray-600 mb-4">
                  Distancias aproximadas entre proyectos (en línea recta)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Proyecto</th>
                        {projects.map((project) => (
                          <th key={project.id} className="text-center py-2 px-3 font-medium text-gray-900">
                            {project.name.split(' ')[0]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project1) => (
                        <tr key={project1.id} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-medium">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: project1.color }}
                              ></div>
                              {project1.name.split(' ')[0]}
                            </div>
                          </td>
                          {projects.map((project2) => {
                            if (project1.id === project2.id) {
                              return <td key={project2.id} className="text-center py-2 px-3 text-gray-400">-</td>;
                            }
                            
                            // Calculate approximate distance using Haversine formula
                            const R = 6371; // Earth's radius in km
                            const dLat = (project2.coordinates[0] - project1.coordinates[0]) * Math.PI / 180;
                            const dLon = (project2.coordinates[1] - project1.coordinates[1]) * Math.PI / 180;
                            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                    Math.cos(project1.coordinates[0] * Math.PI / 180) * Math.cos(project2.coordinates[0] * Math.PI / 180) *
                                    Math.sin(dLon/2) * Math.sin(dLon/2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                            const distance = R * c;
                            
                            return (
                              <td key={project2.id} className="text-center py-2 px-3">
                                {distance.toFixed(1)} km
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Comparando {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
                Exportar Comparación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;

