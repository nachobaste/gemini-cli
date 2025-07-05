'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DatabaseService } from '@/lib/supabase';
import { MCDAParameter, MCDAEvaluation } from '@/types';

interface MCDAFormData {
  [parameterId: string]: {
    value: number | '';
    notes: string;
  };
}

export default function EditMCDAPage({ params }: { params: { id: string } }) {
  const { id: projectId } = params;
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [parameters, setParameters] = useState<MCDAParameter[]>([]);
  const [formData, setFormData] = useState<MCDAFormData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedParameters = await DatabaseService.getMCDAParameters(supabase);
        setParameters(fetchedParameters);

        const fetchedEvaluations = await DatabaseService.getProjectEvaluations(projectId, supabase);
        
        const initialFormData: MCDAFormData = {};
        fetchedParameters.forEach(param => {
          const existingEval = fetchedEvaluations.find((evalItem: any) => evalItem.parameter_id === param.id);
          initialFormData[param.id] = {
            value: existingEval ? existingEval.value : '',
            notes: existingEval ? existingEval.notes || '' : '',
          };
        });
        setFormData(initialFormData);
      } catch (err) {
        console.error('Error fetching MCDA data:', err);
        setError('Failed to load MCDA data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, supabase]);

  const handleChange = (parameterId: string, field: 'value' | 'notes', val: string | number) => {
    setFormData(prev => ({
      ...prev,
      [parameterId]: {
        ...prev[parameterId],
        [field]: val,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const evaluationsToUpsert = Object.entries(formData)
        .filter(([, data]) => data.value !== '') // Only save if a value is provided
        .map(([parameterId, data]) => ({
          project_id: projectId,
          parameter_id: parameterId,
          value: Number(data.value),
          notes: data.notes,
        }));

      for (const evaluation of evaluationsToUpsert) {
        await DatabaseService.upsertMCDAEvaluation(evaluation, supabase);
      }

      router.push(`/projects/${projectId}`); // Redirect back to project detail page
    } catch (err) {
      console.error('Error saving MCDA data:', err);
      setError(`Failed to save MCDA data: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-urbop py-12 text-center">
        <svg className="animate-spin h-12 w-12 text-lime-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Cargando parámetros MCDA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-urbop py-12 text-center text-red-500">
        <p>{error}</p>
        <button onClick={() => router.back()} className="btn btn-secondary mt-4">Volver</button>
      </div>
    );
  }

  return (
    <div className="container-urbop py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Editar Parámetros MCDA para Proyecto {projectId}</h1>
        <Link href={`/projects/${projectId}`} className="btn btn-outline">
          Cancelar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {parameters.map(param => (
            <div key={param.id} className="bg-gray-50 p-4 rounded-lg">
              <label htmlFor={param.id} className="block text-sm font-medium text-gray-700">
                {param.name} ({param.category})
              </label>
              <input
                type="number"
                id={param.id}
                name={param.id}
                value={formData[param.id]?.value || ''}
                onChange={e => handleChange(param.id, 'value', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500"
                min={param.min_value}
                max={param.max_value}
                step="0.1"
              />
              <p className="mt-1 text-xs text-gray-500">Rango: {param.min_value} - {param.max_value}</p>
              <label htmlFor={`${param.id}-notes`} className="block text-sm font-medium text-gray-700 mt-3">Notas</label>
              <textarea
                id={`${param.id}-notes`}
                name={`${param.id}-notes`}
                value={formData[param.id]?.notes || ''}
                onChange={e => handleChange(param.id, 'notes', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500"
                rows={2}
              ></textarea>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Evaluaciones'}
          </button>
        </div>
      </form>
    </div>
  );
}
