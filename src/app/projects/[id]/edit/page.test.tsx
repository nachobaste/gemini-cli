import React from 'react';
import { render, screen } from '@testing-library/react';
import EditProjectPage from './page';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock the DatabaseService
jest.mock('@/lib/supabase', () => ({
  DatabaseService: {
    getProject: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Test Project',
      location: 'Test Location',
      description: 'Test Description',
      status: 'active',
      asset_class: 'residential',
      development_category: 'real_estate_development',
      budget: 1000000,
      area_total: 1000,
      units_count: 10,
      floors_count: 5,
      coordinates: { x: -74.006, y: 40.7128 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
    updateProject: jest.fn().mockResolvedValue({}),
    calculateMCDAScore: jest.fn().mockResolvedValue(85),
  },
}));

describe('EditProjectPage', () => {
  it('renders the project edit form', async () => {
    render(<EditProjectPage params={{ id: '1' }} />);

    // Wait for the loading state to resolve
    expect(await screen.findByText('Editar Proyecto: Test Project')).toBeInTheDocument();

    // Check for some form fields
    expect(screen.getByLabelText('Nombre del Proyecto')).toBeInTheDocument();
    expect(screen.getByLabelText('Ubicación')).toBeInTheDocument();
    expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
  });
});