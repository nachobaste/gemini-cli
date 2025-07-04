'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseService } from '@/lib/supabase';
import { BusinessModelCanvas, BMCTemplate } from '@/types';

export default function EditBMCPage({ params }: { params: { id: string } }) {
  const { id: projectId } = params;
  const router = useRouter();
  const [bmc, setBmc] = useState<Partial<BusinessModelCanvas>>({ project_id: projectId });
  const [templates, setTemplates] = useState<BMCTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [existingBmc, bmcTemplates] = await Promise.all([
          DatabaseService.getBMC(projectId),
          DatabaseService.getBMCTemplates(),
        ]);

        if (existingBmc) {
          setBmc(existingBmc);
        }
        setTemplates(bmcTemplates);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load Business Model Canvas data or templates.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const selectedTemplate = templates.find((t) => t.id === templateId);

    if (selectedTemplate) {
      const { id, asset_class, created_at, updated_at, ...templateData } = selectedTemplate;
      setBmc((prev) => ({ ...prev, ...templateData }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBmc((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await DatabaseService.upsertBMC({
        ...bmc,
        project_id: projectId,
      });
      router.push(`/projects/${projectId}`);
    } catch (err) {
      console.error('Error saving BMC:', err);
      setError('Failed to save Business Model Canvas.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container-urbop py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {bmc.id ? 'Edit' : 'Create'} Business Model Canvas
        </h1>
        <div>
          <label htmlFor="template-select" className="block text-sm font-medium text-gray-400 mr-2">
            Apply Template:
          </label>
          <select
            id="template-select"
            onChange={handleTemplateChange}
            className="bg-gray-800 text-white p-2 rounded-md focus:ring-2 focus:ring-lime-500"
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.asset_class}
              </option>
            ))}
          </select>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="key_partners" className="block text-lg font-semibold mb-2">
                Key Partners
              </label>
              <textarea
                id="key_partners"
                name="key_partners"
                value={bmc.key_partners || ''}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="key_activities" className="block text-lg font-semibold mb-2">
                Key Activities
              </label>
              <textarea
                id="key_activities"
                name="key_activities"
                value={bmc.key_activities || ''}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="key_resources" className="block text-lg font-semibold mb-2">
                Key Resources
              </label>
              <textarea
                id="key_resources"
                name="key_resources"
                value={bmc.key_resources || ''}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="value_proposition" className="block text-lg font-semibold mb-2">
                Value Proposition
              </label>
              <textarea
                id="value_proposition"
                name="value_proposition"
                value={bmc.value_proposition || ''}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="customer_relationships" className="block text-lg font-semibold mb-2">
                Customer Relationships
              </label>
              <textarea
                id="customer_relationships"
                name="customer_relationships"
                value={bmc.customer_relationships || ''}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="channels" className="block text-lg font-semibold mb-2">
                Channels
              </label>
              <textarea
                id="channels"
                name="channels"
                value={bmc.channels || ''}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="customer_segments" className="block text-lg font-semibold mb-2">
                Customer Segments
              </label>
              <textarea
                id="customer_segments"
                name="customer_segments"
                value={bmc.customer_segments || ''}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <label htmlFor="cost_structure" className="block text-lg font-semibold mb-2">
              Cost Structure
            </label>
            <textarea
              id="cost_structure"
              name="cost_structure"
              value={bmc.cost_structure || ''}
              onChange={handleChange}
              rows={5}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
            />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <label htmlFor="revenue_streams" className="block text-lg font-semibold mb-2">
              Revenue Streams
            </label>
            <textarea
              id="revenue_streams"
              name="revenue_streams"
              value={bmc.revenue_streams || ''}
              onChange={handleChange}
              rows={5}
              className="w-full bg-gray-900 text-white p-3 rounded-md focus:ring-2 focus:ring-lime-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save BMC'}
          </button>
        </div>
      </form>
    </div>
  );
}