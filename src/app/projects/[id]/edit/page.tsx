'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DatabaseService } from '@/lib/supabase';
import { Project } from '@/types';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProject = await DatabaseService.getProject(id);
        setProject(fetchedProject);
        setFormData(fetchedProject);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await DatabaseService.updateProject(id, formData);
      router.push(`/projects/${id}`); // Redirect back to project detail page
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project data.');
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
        <p className="mt-4 text-gray-600">Cargando proyecto...</p>
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

  if (!project) {
    return (
      <div className="container-urbop py-12 text-center text-gray-600">
        <p>Proyecto no encontrado.</p>
        <Link href="/projects" className="btn btn-primary mt-4">Volver a Proyectos</Link>
      </div>
    );
  }

  return (
    <div className="container-urbop py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Editar Proyecto: {project.name}</h1>
        <Link href={`/projects/${id}`} className="btn btn-outline">
          Cancelar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Basic Info */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500" required />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
            <input type="text" id="location" name="location" value={formData.location || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500"></textarea>
          </div>

          {/* Status and Asset Class */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
            <select id="status" name="status" value={formData.status || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500">
              <option value="planning">Planificación</option>
              <option value="active">Activo</option>
              <option value="under_review">En Revisión</option>
              <option value="suspended">Suspendido</option>
              <option value="completed">Completado</option>
            </select>
          </div>
          <div>
            <label htmlFor="asset_class" className="block text-sm font-medium text-gray-700">Clase de Activo</label>
            <select id="asset_class" name="asset_class" value={formData.asset_class || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500">
              <option value="residential">Residencial</option>
              <option value="commercial">Comercial</option>
              <option value="mixed_use">Uso Mixto</option>
              <option value="industrial">Industrial</option>
              <option value="office">Oficina</option>
              <option value="retail">Minorista</option>
              <option value="hospitality">Hostelería</option>
            </select>
          </div>

          {/* Numerical Data */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Presupuesto (USD)</label>
            <input type="number" id="budget" name="budget" value={formData.budget || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500" />
          </div>
          <div>
            <label htmlFor="area_total" className="block text-sm font-medium text-gray-700">Área Total (m²)</label>
            <input type="number" id="area_total" name="area_total" value={formData.area_total || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500" />
          </div>
          <div>
            <label htmlFor="units_count" className="block text-sm font-medium text-gray-700">Número de Unidades</label>
            <input type="number" id="units_count" name="units_count" value={formData.units_count || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500" />
          </div>
          <div>
            <label htmlFor="floors_count" className="block text-sm font-medium text-gray-700">Número de Pisos</label>
            <input type="number" id="floors_count" name="floors_count" value={formData.floors_count || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500" />
          </div>

          {/* Coordinates - Display only, not editable directly via form */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Coordenadas (Longitud, Latitud)</label>
            <p className="mt-1 text-gray-900">
              {project?.coordinates ? `${project.coordinates.x}, ${project.coordinates.y}` : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}