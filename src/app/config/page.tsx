''''use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DatabaseService } from '../../lib/supabase';
import { MCDAParameter } from '@/types';
import { FiSliders, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const ConfigPage = () => {
  const [parameters, setParameters] = useState<MCDAParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const parametersByCategory = useMemo(() => {
    return parameters.reduce((acc, param) => {
      const category = param.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(param);
      return acc;
    }, {} as Record<string, MCDAParameter[]>);
  }, [parameters]);

  const handleWeightChange = (id: string, newWeight: number) => {
    setParameters(prevParams =>
      prevParams.map(param =>
        param.id === id ? { ...param, weight: newWeight } : param
      )
    );
  };

  const saveParameters = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await DatabaseService.updateMCDAParameters(parameters);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving parameters:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchParameters = async () => {
      setLoading(true);
      try {
        const data = await DatabaseService.getMCDAParameters();
        setParameters(data);
      } catch (error) {
        console.error('Error fetching parameters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParameters();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-black py-12">
        <div className="container-urbop">
          <div className="flex items-center space-x-4">
            <FiSliders className="h-10 w-10 text-lime" />
            <div>
              <h1 className="text-3xl font-bold">Configuración de Parámetros</h1>
              <p className="text-gray-400 mt-1">Ajusta los pesos de los parámetros para el Análisis de Decisión Multicriterio (MCDA).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parameters Section */}
      <section className="bg-gray-900 py-12">
        <div className="container-urbop">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-12 w-12 text-lime" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(parametersByCategory).map(([category, params]) => (
                <div key={category} className="bg-black p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-3">{category}</h2>
                  <div className="space-y-6">
                    {params.map((param) => (
                      <div key={param.id} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
                        <div className="md:col-span-2">
                          <label className="font-semibold text-white">{param.name}</label>
                          {param.description && <p className="text-sm text-gray-400 mt-1">{param.description}</p>}
                        </div>
                        <div className="md:col-span-3 flex items-center space-x-4">
                          <input
                            type="range"
                            min={param.min_value}
                            max={param.max_value}
                            step="0.01"
                            value={param.weight}
                            onChange={(e) => handleWeightChange(param.id, parseFloat(e.target.value))}
                            className="w-full slider"
                          />
                        </div>
                        <div className="md:col-span-1">
                           <input
                            type="number"
                            min={param.min_value}
                            max={param.max_value}
                            step="0.01"
                            value={param.weight}
                            onChange={(e) => handleWeightChange(param.id, parseFloat(e.target.value))}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-lime"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end items-center mt-8">
                {saveStatus === 'success' && (
                  <div className="flex items-center text-green-400 mr-4 transition-opacity duration-300">
                    <FiCheckCircle className="mr-2" />
                    <span>Cambios guardados exitosamente.</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center text-red-400 mr-4 transition-opacity duration-300">
                    <FiAlertCircle className="mr-2" />
                    <span>Error al guardar. Inténtalo de nuevo.</span>
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  onClick={saveParameters}
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ConfigPage;
'''