'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DatabaseService } from '@/lib/supabase';
import { Project, MCDAEvaluationWithDetails, BusinessModelCanvas } from '@/types';
import dynamic from 'next/dynamic';
import PrintSummary from './PrintSummary'; // Import the new component

// Dynamically import react-leaflet components to prevent SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Import Leaflet itself for custom icon (only if needed for client-side)
let L: typeof import('leaflet');
if (typeof window !== 'undefined') {
  L = require('leaflet');
  // Fix for default markers in Leaflet
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [mcdaScore, setMcdaScore] = useState<number | null>(null);
  const [evaluations, setEvaluations] = useState<MCDAEvaluationWithDetails[]>([]);
  const [bmc, setBmc] = useState<BusinessModelCanvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const handleGenerateReport = () => {
    if (!project || mcdaScore === null || !evaluations || !bmc) {
      console.error('Data not fully loaded for report generation.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Render the PrintSummary component to a string
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Project Summary Report</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap">
            <style>
                @page {
                    size: A4 portrait;
                    margin: 1.5cm;
                }

                body {
                    font-family: 'Inter', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .page-container {
                    width: 100%;
                    max-width: 21cm; /* A4 width */
                    margin: 0 auto;
                    box-sizing: border-box;
                }

                .report-header {
                    text-align: center;
                    margin-bottom: 2cm;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 1cm;
                }

                .report-header h1 {
                    font-size: 2.2em;
                    color: #2c3e50;
                    margin-bottom: 0.5em;
                    font-weight: 700;
                }

                .section {
                    margin-bottom: 1.5cm;
                    padding-bottom: 1cm;
                    border-bottom: 1px solid #eee;
                }

                .section:last-of-type {
                    border-bottom: none;
                }

                .section h2 {
                    font-size: 1.8em;
                    color: #34495e;
                    margin-bottom: 1em;
                    font-weight: 600;
                }

                .section h3 {
                    font-size: 1.4em;
                    color: #34495e;
                    margin-bottom: 0.8em;
                    font-weight: 600;
                }

                /* MCDA Summary */
                .mcda-summary .score-overview {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1.5em;
                }

                .mcda-summary .overall-score {
                    font-size: 1.5em;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-right: 15px;
                }

                .mcda-summary .score-indicator {
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    display: inline-block;
                    vertical-align: middle;
                }

                .mcda-summary .score-green {
                    background-color: #4CAF50;
                }

                .mcda-summary .score-yellow {
                    background-color: #FFC107;
                }

                .mcda-summary .score-red {
                    background-color: #F44336;
                }

                .bar-chart-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* Responsive grid for cards */
                    gap: 15px;
                    padding-top: 20px;
                    border-bottom: none; /* Remove border from container */
                }

                .score-card {
                    background-color: #f9f9f9;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05); /* Subtle shadow for card effect */
                    height: 180px; /* Fixed height for consistency */
                    justify-content: flex-end; /* Align content to bottom */
                    position: relative;
                    overflow: hidden; /* Hide overflow for bars */
                }

                .score-card .bar {
                    width: 100%; /* Bar takes full width of card */
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    border-radius: 0 0 8px 8px; /* Rounded bottom corners for the bar */
                }

                .score-card-label {
                    font-size: 0.9em;
                    font-weight: 600;
                    color: #333;
                    z-index: 1; /* Ensure label is above the bar */
                    margin-bottom: 5px; /* Space between label and bar */
                }

                /* Business Model Canvas */
                .bmc-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5cm;
                }

                .bmc-item {
                    background-color: #f9f9f9;
                    border: 1px solid #eee;
                    padding: 1.2em;
                    border-radius: 5px;
                }

                .bmc-item h3 {
                    font-size: 1.2em;
                    color: #2c3e50;
                    margin-top: 0;
                    margin-bottom: 0.5em;
                    font-weight: 700;
                }

                .bmc-item p {
                    font-size: 0.9em;
                    color: #555;
                    margin-bottom: 0;
                }

                /* Footer */
                .report-footer {
                    text-align: center;
                    margin-top: 2cm;
                    padding-top: 1cm;
                    border-top: 1px solid #eee;
                    font-size: 0.8em;
                    color: #777;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                /* Page breaks for printing */
                @media print {
                    html, body {
                        height: auto;
                    }
                    .page-container {
                        margin: 0;
                        width: auto;
                    }
                    .section {
                        page-break-inside: avoid;
                    }
                    .bmc-grid {
                        page-break-inside: avoid;
                    }
                    .report-footer {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        padding: 1cm 1.5cm;
                        background-color: #fff;
                        border-top: 1px solid #eee;
                    }
                }
            </style>
        </head>
        <body>
            <div class="page-container">
                <header class="report-header">
                    <h1>Project Summary: ${project.name}</h1>
                </header>

                <section class="section mcda-summary">
                    <h2>MCDA Score Overview</h2>
                    <div class="score-overview">
                        <span class="overall-score">Overall GEOCUBO Score: ${mcdaScore !== null ? mcdaScore.toFixed(1) : 'N/A'}</span>
                        <span class="score-indicator ${getScoreColorClass(mcdaScore)}"></span>
                    </div>
                    
                    <h3>Category Scores</h3>
                    <div class="bar-chart-container">
                        ${Object.keys(groupedEvaluations).map(categoryName => {
                            const catScore = getCategoryAverage(categoryName);
                            return `
                                <div class="score-card">
                                    <div class="bar" style="height: ${catScore !== null ? (catScore / 10) * 100 : 0}%; background-color: ${getCategoryScoreColor(catScore)};"></div>
                                    <span class="score-card-label">${categoryName} (${catScore !== null ? catScore.toFixed(1) : 'N/A'})</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </section>

                <section class="section bmc-section">
                    <h2>Business Model Canvas</h2>
                    ${bmc ? `
                        <div class="bmc-grid">
                            <div class="bmc-item">
                                <h3>Key Partners</h3>
                                <p>${bmc.key_partners || 'N/A'}</p>
                            </div>
                            <div class="bmc-item">
                                <h3>Key Activities</h3>
                                <p>${bmc.key_activities || 'N/A'}</p>
                            </div>
                            <div class="bmc-item">
                                <h3>Key Resources</h3>
                                <p>${bmc.key_resources || 'N/A'}</p>
                            </div>
                            <div class="bmc-item">
                                <h3>Value Propositions</h3>
                                <p>${bmc.value_proposition || 'N/A'}</p>
                            </div>
                            <div class="bmc-item">
                                <h3>Customer Relationships</h3>
                                <p>${bmc.customer_relationships || 'N/A'}</p>
                            </div>
                            <div class="bmc-item">
                                <h3>Customer Segments</h3>
                                <p>${bmc.customer_segments || 'N/A'}</p>
                            </div>
                            <div class="bmc-item">
                                <h3>Channels</h3>
                                <p>${bmc.channels || 'N/A'}</p>
                            </div>
                            <div class="bmc-item">
                                <h3>Cost Structure</h3>
                                <p>${bmc.cost_structure || 'N/A'}</p>
                            </div>
                            <div class="bmc-item">
                                <h3>Revenue Streams</h3>
                                <p>${bmc.revenue_streams || 'N/A'}</p>
                            </div>
                        </div>
                    ` : '<p>No Business Model Canvas data available for this project.</p>'}
                </section>

                <footer class="report-footer">
                    <span>Generated by GEOCUBO</span>
                    <span>Date: ${new Date().toLocaleDateString()}</span>
                </footer>
            </div>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const fetchedProject = await DatabaseService.getProject(id);
        setProject(fetchedProject);
        // console.log('Raw project coordinates on detail page:', fetchedProject.coordinates); // Debugging line

        const score = await DatabaseService.calculateMCDAScore(id);
        setMcdaScore(score);

        const fetchedEvaluations = await DatabaseService.getProjectEvaluations(id);
        setEvaluations(fetchedEvaluations);

        const fetchedBmc = await DatabaseService.getBMC(id);
        setBmc(fetchedBmc);

      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'under_review':
        return 'bg-yellow-500';
      case 'suspended':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Prepare coordinates for Leaflet map
  const mapCoordinates: [number, number] | undefined = project?.coordinates ? [project.coordinates.y, project.coordinates.x] : undefined;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-black py-16">
        <div className="container-urbop">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin h-12 w-12 text-lime-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            project && (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <Link
                      href="/projects"
                      className="text-gray-400 hover:text-lime-500 flex items-center mb-4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Volver a Proyectos
                    </Link>
                    <h1 className="mb-2">{project.name}</h1>
                    <div className="flex items-center text-gray-400 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{project.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)} text-white`}
                    >
                      {project.status}
                    </span>
                    {mcdaScore !== null && (
                      <div className="bg-gray-900 rounded-full w-14 h-14 flex items-center justify-center">
                        <span className="text-lime-500 text-xl font-bold">{mcdaScore.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="accent-line"></div>

                <p className="text-xl text-gray-300 mt-6">{project.description}</p>

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
            )
          )}
        </div>
      </section>

      {/* Tab Content */}
      {!loading && project && (
        <section className="bg-gray-900 py-12">
          <div className="container-urbop">
            {/* Render tab content based on activeTab */}
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
                            <div className="text-white">{project.asset_class}</div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Categoría de Desarrollo</label>
                            <div className="text-white">{project.development_category}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Área Total (m²)</label>
                            <div className="text-white">{project.area_total?.toLocaleString() || 'N/A'}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Unidades</label>
                            <div className="text-white">{project.units_count || 'N/A'}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Pisos</label>
                            <div className="text-white">{project.floors_count || 'N/A'}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Fecha de Creación</label>
                            <div className="text-white">{new Date(project.created_at).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Última Actualización</label>
                            <div className="text-white">{new Date(project.updated_at).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Presupuesto</label>
                            <div className="text-white">${project.budget?.toLocaleString() || 'N/A'}</div>
                          </div>
                          
                          {/* ROI is calculated, not directly stored */}
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Timeline - Placeholder */}
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Cronograma del Proyecto (Placeholder)</h2>
                      <div className="text-gray-400">El cronograma del proyecto se mostrará aquí.</div>
                    </div>
                  </div>
                  
                  {/* Project Score and Actions */}
                  <div>
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Puntuación MCDA</h2>
                      
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-32 h-32 rounded-full border-8 border-lime-500 flex items-center justify-center">
                          <span className="text-4xl font-bold">{mcdaScore?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {evaluations.map((evaluation) => (
                          <div key={evaluation.parameter_id}>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-400">{evaluation.parameter_name}</span>
                              <span className="text-lime-500">{evaluation.value.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-lime-500 h-2 rounded-full" 
                                style={{ width: `${(evaluation.value / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Acciones</h2>
                      
                      <div className="space-y-4">
                        <Link href={`/projects/${id}/edit`} className="btn btn-primary w-full text-center">Editar Proyecto</Link>
                        <button className="btn btn-secondary w-full" onClick={handleGenerateReport}>Generar Reporte</button>
                        <button className="btn btn-outline w-full">Compartir</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
                              <div className="w-6 h-6 rounded-full bg-lime-500 animate-ping opacity-50"></div>
                              <div className="w-6 h-6 rounded-full bg-lime-500 absolute top-0 left-0"></div>
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
                          <div className="text-white">{project.location}</div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Coordenadas</label>
                          <div className="text-white">
                            {project.coordinates?.y}, {project.coordinates?.x}
                          </div>
                        </div>
                        
                        {/* Municipality and Department are not directly in project table, need to fetch from municipalities table */}
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Municipalidad</label>
                          <div className="text-white">N/A</div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Departamento</label>
                          <div className="text-white">N/A</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Proximidad (Placeholder)</h2>
                      
                      <div className="text-gray-400">Los datos de proximidad se mostrarán aquí.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'mcda' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* MCDA Analysis */}
                  <div className="md:col-span-2">
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Análisis MCDA</h2>
                      
                      <div className="space-y-8">
                        {/* Group evaluations by category */}
                        {Object.entries(evaluations.reduce((acc, evalItem) => {
                          if (!acc[evalItem.category]) {
                            acc[evalItem.category] = [];
                          }
                          acc[evalItem.category].push(evalItem);
                          return acc;
                        }, {} as Record<string, MCDAEvaluationWithDetails[]>)).map(([categoryName, categoryEvaluations]) => (
                          <div key={categoryName}>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold">{categoryName}</h3>
                              <span className="text-lime-500 font-bold text-xl">{(categoryEvaluations.reduce((sum, item) => sum + item.value, 0) / categoryEvaluations.length).toFixed(1)}</span>
                            </div>
                            
                            <div className="space-y-4">
                              {categoryEvaluations.map((evaluation) => (
                                <div key={evaluation.parameter_id}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">{evaluation.parameter_name}</span>
                                    <span className="text-lime-500">{evaluation.value.toFixed(1)}</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-lime-500 h-2 rounded-full" style={{ width: `${(evaluation.value / 10) * 100}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* MCDA Summary */}
                  <div>
                    <div className="bg-black p-6 rounded-lg mb-8">
                      <h2 className="text-2xl font-bold mb-6">Resumen MCDA</h2>
                      
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-32 h-32 rounded-full border-8 border-lime-500 flex items-center justify-center">
                          <span className="text-4xl font-bold">{mcdaScore?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Group evaluations by category for summary */}
                        {Object.entries(evaluations.reduce((acc, evalItem) => {
                          if (!acc[evalItem.category]) {
                            acc[evalItem.category] = { total: 0, count: 0 };
                          }
                          acc[evalItem.category].total += evalItem.value;
                          acc[evalItem.category].count++;
                          return acc;
                        }, {} as Record<string, { total: number; count: number }>)).map(([categoryName, data]) => (
                          <div key={categoryName}>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-400">{categoryName}</span>
                              <span className="text-lime-500">{(data.total / data.count).toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-lime-500 h-2 rounded-full" 
                                style={{ width: `${((data.total / data.count) / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-black p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-6">Acciones</h2>
                      
                      <div className="space-y-4">
                        <Link href={`/projects/${id}/edit`} className="btn btn-primary w-full text-center">Editar Proyecto</Link>
                        <Link href={`/projects/${id}/mcda/edit`} className="btn btn-secondary w-full text-center">Editar Evaluaciones MCDA</Link>
                        <button className="btn btn-secondary w-full">Generar Reporte</button>
                        <button className="btn btn-outline w-full">Compartir</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'bmc' && (
              <div className="animate-fade-in">
                <div className="bg-black p-6 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold mb-6">Business Model Canvas</h2>
                  
                  {bmc ? (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {/* Key Partners */}
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Socios Clave</h3>
                        <p className="text-gray-400 text-sm">{bmc.key_partners}</p>
                      </div>
                      
                      {/* Key Activities */}
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Actividades Clave</h3>
                        <p className="text-gray-400 text-sm">{bmc.key_activities}</p>
                      </div>
                      
                      {/* Value Proposition */}
                      <div className="bg-lime-500 bg-opacity-10 border border-lime-500 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2 text-lime-500">Propuesta de Valor</h3>
                        <p className="text-gray-300 text-sm">{bmc.value_proposition}</p>
                      </div>
                      
                      {/* Customer Relationships */}
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Relaciones con Clientes</h3>
                        <p className="text-gray-400 text-sm">{bmc.customer_relationships}</p>
                      </div>
                      
                      {/* Customer Segments */}
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Segmentos de Clientes</h3>
                        <p className="text-gray-400 text-sm">{bmc.customer_segments}</p>
                      </div>
                      
                      {/* Key Resources */}
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Recursos Clave</h3>
                        <p className="text-gray-400 text-sm">{bmc.key_resources}</p>
                      </div>
                      
                      {/* Channels */}
                      <div className="bg-gray-900 p-4 rounded-lg md:col-start-4">
                        <h3 className="font-semibold mb-2">Canales</h3>
                        <p className="text-gray-400 text-sm">{bmc.channels}</p>
                      </div>
                      
                      {/* Cost Structure */}
                      <div className="bg-gray-900 p-4 rounded-lg md:col-span-2">
                        <h3 className="font-semibold mb-2">Estructura de Costos</h3>
                        <p className="text-gray-400 text-sm">{bmc.cost_structure}</p>
                      </div>
                      
                      {/* Revenue Streams */}
                      <div className="bg-gray-900 p-4 rounded-lg md:col-span-3">
                        <h3 className="font-semibold mb-2">Fuentes de Ingresos</h3>
                        <p className="text-gray-400 text-sm">{bmc.revenue_streams}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">No hay Business Model Canvas disponible para este proyecto.</div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6">
                  {bmc ? (
                    <Link href={`/projects/${id}/bmc/edit`} className="btn btn-secondary">Editar BMC</Link>
                  ) : (
                    <Link href={`/projects/${id}/bmc/edit`} className="btn btn-primary">Crear BMC</Link>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'financial' && (
              <div className="animate-fade-in">
                <div className="bg-black p-6 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold mb-6">Análisis Financiero (Placeholder)</h2>
                  <div className="text-gray-400">Los datos financieros se mostrarán aquí.</div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}