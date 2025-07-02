'use client';

import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../../lib/supabase';
import { MCDAParameter } from '@/types';

const ConfigPage = () => {
  const [parameters, setParameters] = useState<MCDAParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleWeightChange = (id: string, newWeight: number) => {
    setParameters(prevParams =>
      prevParams.map(param =>
        param.id === id ? { ...param, weight: newWeight } : param
      )
    );
  };

  const saveParameters = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      // Assuming an update method exists in DatabaseService
      // This will need to be implemented in supabase.ts
      await DatabaseService.updateMCDAParameters(parameters);
      alert('Parámetros guardados exitosamente!');
    } catch (error) {
      console.error('Error saving parameters:', error);
      setSaveError('Error al guardar los parámetros. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchParameters = async () => {
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
    <div className="container-urbop py-12">
      <h1 className="section-title mb-8">Configuración de Parámetros MCDA</h1>

      {loading ? (
        <p>Cargando parámetros...</p>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="space-y-8">
            {parameters.map((param) => (
              <div key={param.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div>
                  <label className="font-semibold">{param.name}</label>
                  <p className="text-sm text-gray-500">{param.category}</p>
                </div>
                <div className="md:col-span-2">
                  <input
                    type="range"
                    min={param.min_value}
                    max={param.max_value}
                    value={param.weight}
                    onChange={(e) => handleWeightChange(param.id, parseFloat(e.target.value))}
                    className="w-full slider"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            {saveError && <p className="text-red-500 mb-2">{saveError}</p>}
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
  );
};

export default ConfigPage;
