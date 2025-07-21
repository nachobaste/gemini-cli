'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock project data
  const mockProject = {
    id: parseInt(id),
    name: "Torre Reforma Norte",
    location: "Ciudad de Guatemala",
    type: "Residencial",
    status: "Activo",
    score: 8.7,
    description: "Desarrollo residencial de lujo con 120 apartamentos, áreas comunes y vistas panorámicas a la ciudad. Ubicado estratégicamente cerca de centros comerciales y vías principales.",
    coordinates: { lat: 14.634915, lng: -90.506882 },
    details: {
      area: 12500,
      units: 120,
      floors: 25,
      parking: 180,
      startDate: "2023-06-01",
      endDate: "2025-12-31",
      budget: 25000000,
      roi: 15.8
    },
    mcdaScore: {
      total: 8.7,
      categories: [
        { name: "Características del Sitio", score: 9.2 },
        { name: "Métricas Financieras", score: 8.5 },
        { name: "Factores Sociales", score: 7.8 },
        { name: "Impacto Ambiental", score: 9.1 }
      ]
    },
    bmc: {
      valueProposition: "Apartamentos de lujo con vistas panorámicas y amenidades premium para profesionales y familias de alto nivel adquisitivo.",
      customerSegments: "Profesionales de 30-55 años, familias de alto nivel adquisitivo, inversionistas inmobiliarios.",
      channels: "Ventas directas, agentes inmobiliarios premium, marketing digital dirigido.",
      customerRelationships: "Atención personalizada, club de propietarios, servicios de conserjería.",
      revenueStreams: "Venta de unidades, alquiler de espacios comerciales, servicios premium.",
      keyResources: "Ubicación premium, diseño arquitectónico, materiales de alta calidad.",
      keyActivities: "Desarrollo inmobiliario, marketing de lujo, gestión de relaciones con clientes.",
      keyPartners: "Constructoras de prestigio, diseñadores de interiores, entidades financieras.",
      costStructure: "Adquisición de terreno, construcción, marketing y ventas, gestión de proyecto."
    }
  };
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'activo': return 'bg-green-500';
      case 'en revisión': return 'bg-yellow-500';
      case 'suspendido': return 'bg-red-500';
      case 'completado': return 'bg-blue-500';
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
              <svg className="animate-spin h-12 w-12 text-lime" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <Link href="/projects" className="text-gray-400 hover:text-lime flex items-center mb-4">
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
                  <div className="bg-gray-900 rounded-full w-14 h-14 flex items-center justify-center">
                    <span className="text-lime text-xl font-bold">{project.score}</span>
                  </div>
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
      {!loading && (
        <section className="bg-gray-900 py-12">
          <div className="container-urbop">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Project Details */}
                  <div className="md:col-span-2">
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Detalles del Proyecto</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Tipo de Proyecto</label>
                            <div className="text-white">{project.type}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Área Total (m²)</label>
                            <div className="text-white">{project.details.area.toLocaleString()}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Unidades</label>
                            <div className="text-white">{project.details.units}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Pisos</label>
                            <div className="text-white">{project.details.floors}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Fecha de Inicio</label>
                            <div className="text-white">{new Date(project.details.startDate).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Fecha de Finalización</label>
                            <div className="text-white">{new Date(project.details.endDate).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Presupuesto</label>
                            <div className="text-white">${project.details.budget.toLocaleString()}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">ROI Esperado</label>
                            <div className="text-white">{project.details.roi}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Timeline */}
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Cronograma del Proyecto</h2>
                      
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
                        
                        {/* Timeline items */}
                        <div className="space-y-8 relative">
                          <div className="flex">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime flex items-center justify-center relative z-10">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-6">
                              <h3 className="font-bold">Planificación y Diseño</h3>
                              <p className="text-gray-400 text-sm">Enero 2023 - Mayo 2023</p>
                              <p className="text-gray-300 mt-2">Fase de planificación y diseño arquitectónico completada.</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime flex items-center justify-center relative z-10">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-6">
                              <h3 className="font-bold">Permisos y Licencias</h3>
                              <p className="text-gray-400 text-sm">Junio 2023 - Agosto 2023</p>
                              <p className="text-gray-300 mt-2">Obtención de todos los permisos y licencias necesarios.</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center relative z-10">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-6">
                              <h3 className="font-bold">Construcción - Fase 1</h3>
                              <p className="text-gray-400 text-sm">Septiembre 2023 - Junio 2024</p>
                              <p className="text-gray-300 mt-2">Construcción de cimientos y estructura principal en progreso.</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center relative z-10">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-6">
                              <h3 className="font-bold text-gray-400">Construcción - Fase 2</h3>
                              <p className="text-gray-500 text-sm">Julio 2024 - Marzo 2025</p>
                              <p className="text-gray-500 mt-2">Acabados, instalaciones y áreas comunes.</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center relative z-10">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-6">
                              <h3 className="font-bold text-gray-400">Entrega</h3>
                              <p className="text-gray-500 text-sm">Abril 2025 - Diciembre 2025</p>
                              <p className="text-gray-500 mt-2">Finalización del proyecto y entrega de unidades.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Score and Actions */}
                  <div>
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Puntuación MCDA</h2>
                      
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-32 h-32 rounded-full border-8 border-lime flex items-center justify-center">
                          <span className="text-4xl font-bold">{project.mcdaScore.total}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {project.mcdaScore.categories.map((category, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-400">{category.name}</span>
                              <span className="text-lime">{category.score}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-lime h-2 rounded-full" 
                                style={{ width: `${(category.score / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Acciones</h2>
                      
                      <div className="space-y-4">
                        <button className="btn btn-primary w-full">Editar Proyecto</button>
                        <button className="btn btn-secondary w-full">Generar Reporte</button>
                        <button className="btn btn-outline w-full">Compartir</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Location Tab */}
            {activeTab === 'location' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Map */}
                  <div className="md:col-span-2">
                    <div className="bg-black rounded-lg overflow-hidden" style={{ height: '500px' }}>
                      {/* This would be an actual map component */}
                      <div className="h-full relative">
                        <div className="absolute inset-0 bg-gray-800">
                          {/* Simulated map with URBOP-style design */}
                          <div className="h-full w-full relative overflow-hidden">
                            {/* Map background */}
                            <div className="absolute inset-0 bg-gray-900"></div>
                            
                            {/* Grid lines */}
                            <div className="absolute inset-0" style={{ 
                              backgroundImage: 'linear-gradient(to right, rgba(75, 85, 99, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(75, 85, 99, 0.1) 1px, transparent 1px)',
                              backgroundSize: '50px 50px'
                            }}></div>
                            
                            {/* Project location */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="w-6 h-6 rounded-full bg-lime animate-ping opacity-50"></div>
                              <div className="w-6 h-6 rounded-full bg-lime absolute top-0 left-0"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location Details */}
                  <div>
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Detalles de Ubicación</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Dirección</label>
                          <div className="text-white">Zona 10, Ciudad de Guatemala</div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Coordenadas</label>
                          <div className="text-white">
                            {project.coordinates.lat}, {project.coordinates.lng}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Municipalidad</label>
                          <div className="text-white">Guatemala</div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Departamento</label>
                          <div className="text-white">Guatemala</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Proximidad</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Vías Principales</span>
                            <span className="text-lime">0.3 km</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-lime h-2 rounded-full" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Centros Comerciales</span>
                            <span className="text-lime">0.8 km</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-lime h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Hospitales</span>
                            <span className="text-lime">1.5 km</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-lime h-2 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Escuelas</span>
                            <span className="text-lime">1.2 km</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-lime h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* MCDA Tab */}
            {activeTab === 'mcda' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* MCDA Analysis */}
                  <div className="md:col-span-2">
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Análisis MCDA</h2>
                      
                      <div className="space-y-8">
                        {/* Category 1 */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Características del Sitio</h3>
                            <span className="text-lime font-bold text-xl">9.2</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Proximidad a Vías Principales</span>
                                <span className="text-lime">9.5</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '95%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Acceso a Servicios</span>
                                <span className="text-lime">9.0</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Topografía</span>
                                <span className="text-lime">8.8</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '88%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Proximidad a Centros Urbanos</span>
                                <span className="text-lime">9.5</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '95%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Category 2 */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Métricas Financieras</h3>
                            <span className="text-lime font-bold text-xl">8.5</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">ROI</span>
                                <span className="text-lime">8.8</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '88%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">VAN</span>
                                <span className="text-lime">8.5</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">TIR</span>
                                <span className="text-lime">8.2</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '82%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Category 3 */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Factores Sociales</h3>
                            <span className="text-lime font-bold text-xl">7.8</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Impacto en la Comunidad</span>
                                <span className="text-lime">7.5</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Generación de Empleo</span>
                                <span className="text-lime">8.2</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '82%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Accesibilidad</span>
                                <span className="text-lime">7.6</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '76%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Category 4 */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Impacto Ambiental</h3>
                            <span className="text-lime font-bold text-xl">9.1</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Eficiencia Energética</span>
                                <span className="text-lime">9.3</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '93%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Gestión de Residuos</span>
                                <span className="text-lime">8.8</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '88%' }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-400">Uso de Materiales Sostenibles</span>
                                <span className="text-lime">9.2</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-lime h-2 rounded-full" style={{ width: '92%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* MCDA Summary */}
                  <div>
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Resumen MCDA</h2>
                      
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-32 h-32 rounded-full border-8 border-lime flex items-center justify-center">
                          <span className="text-4xl font-bold">{project.mcdaScore.total}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {project.mcdaScore.categories.map((category, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-400">{category.name}</span>
                              <span className="text-lime">{category.score}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-lime h-2 rounded-full" 
                                style={{ width: `${(category.score / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Acciones</h2>
                      
                      <div className="space-y-4">
                        <button className="btn btn-primary w-full">Recalcular MCDA</button>
                        <button className="btn btn-secondary w-full">Ajustar Parámetros</button>
                        <button className="btn btn-outline w-full">Exportar Análisis</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* BMC Tab */}
            {activeTab === 'bmc' && (
              <div className="animate-fade-in">
                <div className="bg-black p-6 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold mb-6">Business Model Canvas</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Key Partners */}
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Socios Clave</h3>
                      <p className="text-gray-400 text-sm">{project.bmc.keyPartners}</p>
                    </div>
                    
                    {/* Key Activities */}
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Actividades Clave</h3>
                      <p className="text-gray-400 text-sm">{project.bmc.keyActivities}</p>
                    </div>
                    
                    {/* Value Proposition */}
                    <div className="bg-lime bg-opacity-10 border border-lime p-4 rounded-lg">
                      <h3 className="font-semibold mb-2 text-lime">Propuesta de Valor</h3>
                      <p className="text-gray-300 text-sm">{project.bmc.valueProposition}</p>
                    </div>
                    
                    {/* Customer Relationships */}
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Relaciones con Clientes</h3>
                      <p className="text-gray-400 text-sm">{project.bmc.customerRelationships}</p>
                    </div>
                    
                    {/* Customer Segments */}
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Segmentos de Clientes</h3>
                      <p className="text-gray-400 text-sm">{project.bmc.customerSegments}</p>
                    </div>
                    
                    {/* Key Resources */}
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Recursos Clave</h3>
                      <p className="text-gray-400 text-sm">{project.bmc.keyResources}</p>
                    </div>
                    
                    {/* Channels */}
                    <div className="bg-gray-900 p-4 rounded-lg md:col-start-4">
                      <h3 className="font-semibold mb-2">Canales</h3>
                      <p className="text-gray-400 text-sm">{project.bmc.channels}</p>
                    </div>
                    
                    {/* Cost Structure */}
                    <div className="bg-gray-900 p-4 rounded-lg md:col-span-2">
                      <h3 className="font-semibold mb-2">Estructura de Costos</h3>
                      <p className="text-gray-400 text-sm">{project.bmc.costStructure}</p>
                    </div>
                    
                    {/* Revenue Streams */}
                    <div className="bg-gray-900 p-4 rounded-lg md:col-span-3">
                      <h3 className="font-semibold mb-2">Fuentes de Ingresos</h3>
                      <p className="text-gray-400 text-sm">{project.bmc.revenueStreams}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button className="btn btn-secondary">Editar BMC</button>
                  <button className="btn btn-primary">Guardar Cambios</button>
                </div>
              </div>
            )}
            
            {/* Financial Analysis Tab */}
            {activeTab === 'financial' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Financial Metrics */}
                  <div className="md:col-span-2">
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Métricas Financieras</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Inversión Total</label>
                            <div className="text-white">${project.details.budget.toLocaleString()}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">ROI Esperado</label>
                            <div className="text-white">{project.details.roi}%</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">VAN</label>
                            <div className="text-white">$5,250,000</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">TIR</label>
                            <div className="text-white">18.5%</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Período de Recuperación</label>
                            <div className="text-white">3.2 años</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Tasa de Descuento</label>
                            <div className="text-white">10%</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Precio Promedio por m²</label>
                            <div className="text-white">$2,100</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Costo por m²</label>
                            <div className="text-white">$1,200</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cash Flow Chart */}
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Flujo de Caja Proyectado</h2>
                      
                      <div className="h-64 bg-gray-900 rounded-lg p-4">
                        {/* This would be an actual chart component */}
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <p className="text-gray-400">Gráfico de Flujo de Caja</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Financial Summary */}
                  <div>
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Resumen Financiero</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-3">Rentabilidad</h3>
                          <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-lime flex items-center justify-center mr-4">
                              <span className="text-xl font-bold">A+</span>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Calificación</div>
                              <div className="text-lg font-semibold">Excelente</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-3">Riesgo</h3>
                          <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-yellow-500 flex items-center justify-center mr-4">
                              <span className="text-xl font-bold">B</span>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Calificación</div>
                              <div className="text-lg font-semibold">Moderado</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-3">Liquidez</h3>
                          <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-lime flex items-center justify-center mr-4">
                              <span className="text-xl font-bold">A</span>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Calificación</div>
                              <div className="text-lg font-semibold">Muy Buena</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Acciones</h2>
                      
                      <div className="space-y-4">
                        <button className="btn btn-primary w-full">Análisis Detallado</button>
                        <button className="btn btn-secondary w-full">Escenarios Financieros</button>
                        <button className="btn btn-outline w-full">Exportar a Excel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
