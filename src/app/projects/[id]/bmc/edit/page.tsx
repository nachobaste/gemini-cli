'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseService } from '@/lib/supabase';
import { BusinessModelCanvas } from '@/types';

export default function EditBMCPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [bmc, setBmc] = useState<Partial<BusinessModelCanvas>>({});
  const [bmcTemplates, setBmcTemplates] = useState<BusinessModelCanvas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [existingBmc, templates] = await Promise.all([
          DatabaseService.getBMC(id),
          DatabaseService.getBMCTemplates(),
        ]);

        if (existingBmc) {
          setBmc(existingBmc);
        }
        setBmcTemplates(templates);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBmc((prevBmc) => ({ ...prevBmc, [name]: value }));
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAssetClass = e.target.value;
    const template = bmcTemplates.find(t => t.asset_class === selectedAssetClass);
    if (template) {
      setBmc(prevBmc => ({
        id: prevBmc.id,
        project_id: prevBmc.project_id,
        value_proposition: template.value_proposition,
        customer_segments: template.customer_segments,
        channels: template.channels,
        customer_relationships: template.customer_relationships,
        revenue_streams: template.revenue_streams,
        key_resources: template.key_resources,
        key_activities: template.key_activities,
        key_partners: template.key_partners,
        cost_structure: template.cost_structure,
      }));
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="section-title">Editar Business Model Canvas</h1>
        <div>
          <label htmlFor="bmc-template" className="block text-gray-400 text-sm mb-1">Cargar plantilla</label>
          <select
            id="bmc-template"
            onChange={handleTemplateChange}
            className="select select-bordered w-full max-w-xs"
            defaultValue=""
          >
            <option value="" disabled>Seleccionar plantilla...</option>
            {bmcTemplates.map((template) => (
              <option key={template.id} value={template.asset_class}>
                {template.asset_class}
              </option>
            ))}
          </select>
        </div>
      </div>
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
