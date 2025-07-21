import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the components that might have external dependencies
jest.mock('@/app/map/MapComponent', () => {
  return function MockMapComponent() {
    return <div data-testid="mock-map">Map Component</div>;
  };
});

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders the navigation menu', () => {
    render(<Home />);
    
    // Check for navigation links
    expect(screen.getByText(/proyectos/i)).toBeInTheDocument();
    expect(screen.getByText(/mapa/i)).toBeInTheDocument();
    expect(screen.getByText(/configuración/i)).toBeInTheDocument();
  });

  it('renders the features section', () => {
    render(<Home />);
    
    // Check for features section
    expect(screen.getByText(/características principales/i)).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<Home />);
    
    // Check for CTA buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('has proper accessibility attributes', () => {
    render(<Home />);
    
    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    
    // Check for navigation landmark
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});

