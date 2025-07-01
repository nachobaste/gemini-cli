'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseService } from '@/lib/supabase';
import { BusinessModelCanvas } from '@/types';

export default function EditBMCPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [bmc, setBmc] = useState<Partial<BusinessModelCanvas>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBmc = async () => {
      try {
        const existingBmc = await DatabaseService.getBMC(id);
        if (existingBmc) {
          setBmc(existingBmc);
        }
      } catch (error) {
        console.error('Error fetching BMC data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBmc();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBmc((prevBmc) => ({ ...prevBmc, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await DatabaseService.upsertBMC({ ...bmc, project_id: id });
      router.push(`/projects/${id}`);
    } catch (error) {
      console.error('Error saving BMC data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-urbop py-12">
      <h1 className="section-title">Editar Business Model Canvas</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="value_proposition" className="block text-gray-400 text-sm mb-1">Propuesta de Valor</label>
            <textarea id="value_proposition" name="value_proposition" value={bmc.value_proposition || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
          <div>
            <label htmlFor="customer_segments" className="block text-gray-400 text-sm mb-1">Segmentos de Clientes</label>
            <textarea id="customer_segments" name="customer_segments" value={bmc.customer_segments || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
          <div>
            <label htmlFor="channels" className="block text-gray-400 text-sm mb-1">Canales</label>
            <textarea id="channels" name="channels" value={bmc.channels || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
          <div>
            <label htmlFor="customer_relationships" className="block text-gray-400 text-sm mb-1">Relaciones con Clientes</label>
            <textarea id="customer_relationships" name="customer_relationships" value={bmc.customer_relationships || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
          <div>
            <label htmlFor="revenue_streams" className="block text-gray-400 text-sm mb-1">Fuentes de Ingresos</label>
            <textarea id="revenue_streams" name="revenue_streams" value={bmc.revenue_streams || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
          <div>
            <label htmlFor="key_resources" className="block text-gray-400 text-sm mb-1">Recursos Clave</label>
            <textarea id="key_resources" name="key_resources" value={bmc.key_resources || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
          <div>
            <label htmlFor="key_activities" className="block text-gray-400 text-sm mb-1">Actividades Clave</label>
            <textarea id="key_activities" name="key_activities" value={bmc.key_activities || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
          <div>
            <label htmlFor="key_partners" className="block text-gray-400 text-sm mb-1">Socios Clave</label>
            <textarea id="key_partners" name="key_partners" value={bmc.key_partners || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
          <div>
            <label htmlFor="cost_structure" className="block text-gray-400 text-sm mb-1">Estructura de Costos</label>
            <textarea id="cost_structure" name="cost_structure" value={bmc.cost_structure || ''} onChange={handleInputChange} className="textarea w-full"></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}
