# GEOCUBO Development Guide

This guide provides comprehensive information for developers working on the GEOCUBO platform, including architecture overview, development workflows, and contribution guidelines.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Development Environment](#development-environment)
3. [Project Structure](#project-structure)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Frontend Architecture](#frontend-architecture)
7. [Development Workflow](#development-workflow)
8. [Testing Strategy](#testing-strategy)
9. [Performance Guidelines](#performance-guidelines)
10. [Contributing](#contributing)

## Architecture Overview

GEOCUBO is built as a modern web application using a serverless architecture with the following key components:

### Technology Stack

- **Frontend**: Next.js 14 with React 18 and TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **Database**: PostgreSQL with PostGIS via Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended) or other platforms
- **Maps**: Leaflet with React-Leaflet
- **State Management**: React hooks and context

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   External      │
│   (Next.js)     │◄──►│   (Database)    │    │   Services      │
│                 │    │                 │    │                 │
│ • React Pages   │    │ • PostgreSQL    │    │ • Map Tiles     │
│ • Components    │    │ • PostGIS       │    │ • Analytics     │
│ • API Routes    │    │ • Auth          │    │ • Monitoring    │
│ • State Mgmt    │    │ • Storage       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Features

1. **Multi-Criteria Decision Analysis (MCDA)**
   - Configurable parameters and weights
   - Real-time score calculations
   - Category-based evaluation system

2. **Business Model Canvas Integration**
   - Interactive BMC editor
   - Project-specific business models
   - Export and sharing capabilities

3. **Geographic Information System (GIS)**
   - Interactive maps with Leaflet
   - Project location visualization
   - Municipal boundary data

4. **Project Management**
   - Kanban-style project tracking
   - Status management and workflows
   - File upload and document management

## Development Environment

### Prerequisites

Ensure you have the following installed:

- Node.js 18+ with npm
- Git for version control
- VS Code (recommended IDE)
- PostgreSQL client (optional, for direct DB access)

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/geocubo.git
   cd geocubo
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Database Setup**
   - Create a Supabase project
   - Run the SQL scripts in `/database/` folder
   - Verify tables and sample data

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Development Tools

#### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**: React code snippets
- **Tailwind CSS IntelliSense**: Tailwind class autocomplete
- **TypeScript Importer**: Auto-import TypeScript modules
- **GitLens**: Enhanced Git capabilities
- **Prettier**: Code formatting
- **ESLint**: Code linting

#### Browser Extensions
- **React Developer Tools**: Debug React components
- **Redux DevTools**: State management debugging (if using Redux)

## Project Structure

```
geocubo/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── api/               # API routes
│   │   ├── config/            # Configuration pages
│   │   ├── map/               # Map explorer
│   │   ├── projects/          # Project management
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # Basic UI components
│   │   ├── forms/            # Form components
│   │   ├── maps/             # Map-related components
│   │   └── charts/           # Data visualization
│   ├── lib/                  # Utilities and configurations
│   │   ├── supabase.ts       # Supabase client
│   │   ├── mcda-engine.ts    # MCDA calculations
│   │   └── utils.ts          # Helper functions
│   ├── types/                # TypeScript type definitions
│   └── hooks/                # Custom React hooks
├── database/                 # Database schema and migrations
├── docs/                     # Documentation
├── public/                   # Static assets
├── tests/                    # Test files
└── scripts/                  # Build and deployment scripts
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard.tsx`)
- **Pages**: lowercase with hyphens (e.g., `project-detail.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Projects  │    │ MCDA Parameters │    │ MCDA Evaluations│
│             │    │                 │    │                 │
│ • id (PK)   │    │ • id (PK)       │    │ • id (PK)       │
│ • name      │◄──►│ • name          │◄──►│ • project_id    │
│ • location  │    │ • category      │    │ • parameter_id  │
│ • status    │    │ • weight        │    │ • value         │
│ • budget    │    │ • description   │    │ • notes         │
└─────────────┘    └─────────────────┘    └─────────────────┘
       │
       ▼
┌─────────────────┐
│ Business Model  │
│ Canvas          │
│                 │
│ • id (PK)       │
│ • project_id    │
│ • value_prop    │
│ • customers     │
│ • channels      │
└─────────────────┘
```

### Key Tables

1. **projects**: Core project information
2. **mcda_parameters**: Configurable evaluation criteria
3. **mcda_evaluations**: Project-specific parameter values
4. **business_model_canvas**: BMC data for each project
5. **municipalities**: Geographic reference data
6. **user_profiles**: Extended user information

### Database Functions

The system includes several PostgreSQL functions for complex operations:

- `calculate_mcda_score(project_id)`: Computes weighted MCDA score
- `get_project_summary(project_id)`: Returns project with calculated metrics
- `search_projects(term, status, asset_class)`: Advanced project search
- `upsert_mcda_evaluation()`: Updates or inserts evaluation data

## API Design

### RESTful Endpoints

The application uses Supabase's auto-generated REST API with custom functions:

#### Projects
- `GET /rest/v1/projects` - List all projects
- `GET /rest/v1/projects?id=eq.{id}` - Get specific project
- `POST /rest/v1/projects` - Create new project
- `PATCH /rest/v1/projects?id=eq.{id}` - Update project
- `DELETE /rest/v1/projects?id=eq.{id}` - Delete project

#### MCDA Operations
- `POST /rest/v1/rpc/calculate_mcda_score` - Calculate MCDA score
- `POST /rest/v1/rpc/get_project_evaluations` - Get project evaluations
- `POST /rest/v1/rpc/upsert_mcda_evaluation` - Update evaluation

#### Search and Filtering
- `POST /rest/v1/rpc/search_projects` - Advanced project search
- `GET /rest/v1/mcda_parameters?is_active=eq.true` - Get active parameters

### API Client

The `DatabaseService` class in `/src/lib/supabase.ts` provides a typed interface for all database operations:

```typescript
// Example usage
const projects = await DatabaseService.getProjects();
const score = await DatabaseService.calculateMCDAScore(projectId);
const bmc = await DatabaseService.getBMC(projectId);
```

## Frontend Architecture

### Component Hierarchy

```
App Layout
├── Navigation Header
├── Main Content Area
│   ├── Page-specific Components
│   │   ├── Project List/Detail
│   │   ├── Map Explorer
│   │   ├── Configuration Forms
│   │   └── Dashboard Charts
│   └── Shared Components
│       ├── Forms and Inputs
│       ├── Data Tables
│       ├── Modal Dialogs
│       └── Loading States
└── Footer
```

### State Management

The application uses React's built-in state management:

- **Local State**: `useState` for component-specific data
- **Context**: `useContext` for shared application state
- **Server State**: Supabase real-time subscriptions
- **URL State**: Next.js router for navigation state

### Styling Architecture

Tailwind CSS is used with a utility-first approach:

```css
/* Component-specific styles in globals.css */
.btn-primary {
  @apply bg-lime-500 hover:bg-lime-600 text-white font-medium py-2 px-4 rounded-lg transition-colors;
}

.card {
  @apply bg-white border border-gray-200 rounded-xl shadow-sm p-6;
}
```

### Responsive Design

The application follows a mobile-first approach:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

Key breakpoints are defined in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

## Development Workflow

### Git Workflow

We follow a simplified Git Flow:

1. **Main Branch**: Production-ready code
2. **Develop Branch**: Integration branch for features
3. **Feature Branches**: Individual feature development
4. **Hotfix Branches**: Critical production fixes

#### Branch Naming Convention
- Feature: `feature/mcda-calculator`
- Bugfix: `bugfix/map-rendering-issue`
- Hotfix: `hotfix/security-patch`

### Development Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   ```

2. **Development**
   - Write code following style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Testing**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add MCDA parameter validation"
   ```

5. **Create Pull Request**
   - Push branch to GitHub
   - Create PR against develop branch
   - Request code review

### Commit Message Convention

We follow the Conventional Commits specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Build process or auxiliary tool changes

## Testing Strategy

### Testing Pyramid

1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Component interactions
3. **End-to-End Tests**: Complete user workflows

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **MSW**: API mocking for tests

### Test Structure

```
tests/
├── __mocks__/           # Mock implementations
├── unit/               # Unit tests
│   ├── components/     # Component tests
│   ├── lib/           # Utility function tests
│   └── hooks/         # Custom hook tests
├── integration/        # Integration tests
└── e2e/               # End-to-end tests
```

### Writing Tests

#### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '@/components/ProjectCard';

describe('ProjectCard', () => {
  it('displays project information correctly', () => {
    const project = {
      id: '1',
      name: 'Test Project',
      status: 'active',
      budget: 1000000
    };

    render(<ProjectCard project={project} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
  });
});
```

#### API Test Example
```typescript
import { DatabaseService } from '@/lib/supabase';

describe('DatabaseService', () => {
  it('calculates MCDA score correctly', async () => {
    const projectId = 'test-project-id';
    const score = await DatabaseService.calculateMCDAScore(projectId);
    
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(10);
  });
});
```

## Performance Guidelines

### Frontend Performance

1. **Code Splitting**
   ```typescript
   // Dynamic imports for large components
   const MapComponent = dynamic(() => import('./MapComponent'), {
     loading: () => <LoadingSpinner />
   });
   ```

2. **Image Optimization**
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/project-image.jpg"
     alt="Project"
     width={400}
     height={300}
     priority={false}
   />
   ```

3. **Memoization**
   ```typescript
   const MemoizedComponent = React.memo(({ data }) => {
     return <ExpensiveComponent data={data} />;
   });
   ```

### Database Performance

1. **Query Optimization**
   - Use indexes on frequently queried columns
   - Limit result sets with pagination
   - Use database functions for complex calculations

2. **Connection Management**
   - Use connection pooling
   - Implement proper error handling
   - Monitor connection usage

### Monitoring

1. **Core Web Vitals**
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

2. **Database Metrics**
   - Query execution time
   - Connection count
   - Cache hit ratio

## Contributing

### Code Style Guidelines

1. **TypeScript**
   - Use strict type checking
   - Define interfaces for all data structures
   - Avoid `any` type

2. **React**
   - Use functional components with hooks
   - Implement proper error boundaries
   - Follow React best practices

3. **CSS**
   - Use Tailwind utility classes
   - Create component-specific styles when needed
   - Maintain consistent spacing and colors

### Pull Request Process

1. **Before Submitting**
   - Ensure all tests pass
   - Update documentation
   - Follow code style guidelines

2. **PR Description**
   - Clear description of changes
   - Link to related issues
   - Include screenshots for UI changes

3. **Review Process**
   - At least one approval required
   - Address all review comments
   - Ensure CI/CD checks pass

### Documentation Standards

1. **Code Documentation**
   - JSDoc comments for functions
   - README files for complex modules
   - Inline comments for complex logic

2. **API Documentation**
   - Document all endpoints
   - Include request/response examples
   - Maintain up-to-date schemas

### Getting Help

1. **Internal Resources**
   - Check existing documentation
   - Review similar implementations
   - Ask team members

2. **External Resources**
   - Next.js documentation
   - Supabase documentation
   - React documentation
   - Tailwind CSS documentation

3. **Community**
   - GitHub Discussions
   - Stack Overflow
   - Discord communities

---

This development guide provides the foundation for contributing to GEOCUBO. Follow these guidelines to ensure consistent, maintainable, and high-quality code.

