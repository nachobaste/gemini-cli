GEOCUBO is a sophisticated platform designed to revolutionize urban development analysis in Latin America. At its core, GEOCUBO provides a robust framework for
  Multi-Criteria Decision Analysis (MCDA), enabling stakeholders to transform complex urban data into actionable, strategic decisions. The platform aims to streamline
  the evaluation, planning, and management of urban projects by integrating geospatial analysis, quantitative decision-making tools, and business modeling capabilities.

  Core Purpose and Features:


   1. Intelligent Urban Analysis: GEOCUBO's primary purpose is to facilitate data-driven decision-making for urban development. It moves beyond traditional, often
      subjective, evaluation methods by providing a structured, quantifiable approach to assess project viability and impact.
   2. Multi-Criteria Decision Analysis (MCDA) Engine:
       * Concept: MCDA is a decision-making methodology that evaluates multiple conflicting criteria in decision-making. In GEOCUBO, this translates to assessing urban
         projects against a comprehensive set of parameters (e.g., environmental impact, economic feasibility, social equity, infrastructure availability).
       * Functionality: The platform allows users to define and configure up to 13 distinct parameters, each with customizable weights, minimum, and maximum values. This
         flexibility ensures that the analysis can be tailored to specific project requirements and regional priorities.
       * Score Calculation: A key feature is the calculate_mcda_score function, which aggregates the weighted values of these parameters to produce a single, normalized
         viability score for each project. This score provides a clear, objective metric for comparison and prioritization.
   3. GIS Map Explorer:
       * Geospatial Visualization: This module offers an interactive Geographic Information System (GIS) map interface. Users can visualize projects within their
         geographical context, overlaying various data layers such as population density, infrastructure networks, land use, and environmental zones.
       * Advanced Filtering & Analysis: The GIS explorer supports advanced filtering capabilities, allowing users to narrow down projects based on location, asset class,
         status, or even MCDA scores. This enables targeted analysis and identification of optimal development sites.
       * Data Layers: The integration of PostGIS in the database allows for efficient storage and querying of spatial data, enabling dynamic rendering of municipal
         boundaries, road networks, and other critical geospatial information.
   4. Business Model Canvas (BMC) Integration:
       * Strategic Planning: GEOCUBO incorporates a dedicated module for the Business Model Canvas, a strategic management tool for developing new or documenting existing
         business models.
       * Real Estate Focus: This BMC module is specifically tailored for the real estate sector, providing predefined templates for different asset classes (e.g.,
         residential, commercial). This helps users structure their project's value proposition, customer segments, revenue streams, cost structures, and key
         resources/activities/partners.
       * Holistic View: By linking the BMC to individual projects, GEOCUBO provides a holistic view that combines quantitative viability analysis with strategic business
         planning.

  Development Architecture:


  GEOCUBO is built as a modern, full-stack web application, leveraging a robust set of technologies to ensure scalability, performance, and maintainability.

  1. Frontend Architecture:


   * Framework: Next.js (React Framework)
       * Server-Side Rendering (SSR) / Static Site Generation (SSG): Next.js is chosen for its ability to perform SSR and SSG, which improves initial page load times,
         enhances SEO, and provides a better user experience. This is particularly beneficial for content-heavy pages like project listings and map explorers.
       * File-System Based Routing: Simplifies navigation and organization of different sections of the application (e.g., /map, /projects, /config).
       * API Routes: Next.js API routes are used to create backend endpoints within the same project, facilitating seamless communication between the frontend and backend
         logic, especially for data fetching and manipulation.
   * UI Library: React
       * Component-Based Development: The user interface is built using React's declarative and component-based paradigm, promoting reusability, modularity, and easier
         management of complex UI states.
       * Hooks: Modern React Hooks (useState, useEffect, usePathname from next/navigation) are extensively used for state management, side effects, and accessing routing
         information.
   * Styling: Tailwind CSS
       * Utility-First CSS Framework: Tailwind CSS is employed for rapid UI development. Its utility-first approach allows for highly customizable designs directly within
         the JSX, reducing the need for custom CSS and promoting consistency.
       * Responsive Design: Tailwind's responsive utilities ensure that the application adapts seamlessly across various screen sizes and devices.
   * Language: TypeScript
       * Static Type Checking: TypeScript is used throughout the frontend codebase to provide static type checking. This significantly reduces runtime errors, improves
         code readability, and enhances developer productivity by catching type-related bugs during development.
       * Interfaces and Types: Custom interfaces (e.g., Project, MCDAParameter, BusinessModelCanvas) are defined to enforce data structures and ensure consistency between
         the frontend and backend data models.
   * Data Fetching & Management:
       * The src/lib/supabase.ts file encapsulates all interactions with the Supabase backend. It provides a DatabaseService class with static methods for fetching,
         creating, updating, and deleting data for various entities (Projects, MCDA Parameters, BMC, Municipalities, User Profiles).
       * supabase-js client library is used for direct interaction with Supabase APIs, including database queries, RPC calls to custom PostgreSQL functions, and
         authentication.

  2. Backend Architecture:


   * Database: PostgreSQL
       * Relational Database: PostgreSQL is chosen for its robustness, reliability, and advanced features, including support for custom functions, triggers, and extensions
         like PostGIS.
   * Backend-as-a-Service (BaaS): Supabase
       * Authentication: Supabase handles user authentication, providing secure sign-in mechanisms and managing user sessions. The auth.users table is integrated with
         user_profiles for extended user information.
       * Database Management: Supabase provides a managed PostgreSQL instance, simplifying database setup, scaling, and maintenance.
       * Realtime Capabilities: While not explicitly detailed in the provided code, Supabase's realtime engine could enable live updates for collaborative features or
         dynamic dashboards.
       * Storage: Supabase Storage is used for managing project-related files, with defined policies for secure uploads, downloads, and deletions.
   * Database Schema (`database/01_schema.sql`):
       * `projects`: Stores core project information, including name, description, location, coordinates (using PostGIS POINT type), status, asset class, budget, and area.
         It includes foreign keys to auth.users for tracking creation and updates.
       * `mcda_parameters`: Defines the configurable parameters for MCDA, including name, category, weight, min/max values, and active status.
       * `mcda_evaluations`: Records the evaluated value of each MCDA parameter for a specific project, linking projects and mcda_parameters. It enforces uniqueness per
         project-parameter pair.
       * `business_model_canvas`: Stores the BMC details for each project, with fields for value proposition, customer segments, channels, etc.
       * `municipalities`: Contains geospatial data for municipalities (name, department, country, GEOMETRY for polygons, population, area). This table is crucial for the
         GIS map explorer.
       * `project_files`: Manages metadata for files associated with projects (filename, path, size, MIME type).
       * `user_profiles`: Extends Supabase's auth.users table with additional user-specific information like full name, organization, and role.
       * Indexes: Various indexes are created on frequently queried columns (e.g., projects.status, mcda_evaluations.project_id, municipalities.geometry) to optimize
         database query performance.
       * Triggers: update_updated_at_column function and associated triggers automatically update the updated_at timestamp on relevant tables (projects,
         business_model_canvas, user_profiles) upon modification.
   * Database Functions (`database/02_functions.sql`, `08_create_calculate_mcda_score_function.sql`, `09_create_upsert_mcda_evaluation_function.sql`):
       * `calculate_mcda_score(project_uuid UUID)`: This is a critical PL/pgSQL function that computes the overall MCDA score for a given project. It iterates through
         active MCDA parameters, retrieves their evaluated values for the project, applies the defined weights, and normalizes the score to a 0-10 scale. This function
         centralizes the complex scoring logic.
       * `upsert_mcda_evaluation(...)`: This function handles the insertion or updating of MCDA evaluation values for a project and parameter. It uses ON CONFLICT to
         ensure that if an evaluation for a specific project-parameter pair already exists, it's updated instead of creating a duplicate.
       * `get_project_summary(project_uuid UUID)`: Retrieves a summary of a single project, including its calculated MCDA score.
       * `get_all_projects_with_scores()`: Fetches all projects along with their respective MCDA scores, ordered by creation date.
       * `get_mcda_parameters_by_category()`: Organizes MCDA parameters by their categories, returning them as JSON objects.
       * `get_project_evaluations(project_uuid UUID)`: Retrieves all MCDA parameters for a project, including their evaluated values and notes if available.
       * `search_projects(...)`: Provides a flexible search mechanism for projects based on search terms, status, and asset class, also including the MCDA score in the
         results.
   * Row Level Security (RLS) Policies (`database/03_policies.sql`):
       * Granular Access Control: RLS is enabled on all application tables to enforce fine-grained access control directly at the database level. This is a crucial
         security measure.
       * Policies Defined:
           * `projects`: Users can view all projects, but only authenticated users can create new ones. Users can only update or delete projects they created.
           * `mcda_parameters`: Read-only for most users; only users with the 'admin' role can modify parameters.
           * `mcda_evaluations`: Users can view all evaluations. Authenticated users can create evaluations, and can update/delete evaluations for projects they created.
           * `business_model_canvas`: Similar to mcda_evaluations, allowing authenticated users to create and manage BMCs for their own projects.
           * `municipalities`: Read-only for all users.
           * `project_files`: Users can view files for any project they can see, but can only upload/delete files to projects they created.
           * `user_profiles`: Users can view all profiles, but can only update or insert their own profile.
       * `handle_new_user()` Function & Trigger: A PL/pgSQL function handle_new_user automatically creates a corresponding entry in the user_profiles table whenever a new
         user registers via Supabase Authentication.
   * BMC Templates (`database/05_bmc_templates.sql`):
       * A bmc_templates table stores predefined Business Model Canvas structures for different asset_class types, providing a starting point for new projects.
   * PostGIS Enablement (`database/07_enable_postgis.sql`):
       * Ensures the PostGIS extension is enabled in the database, which is essential for handling and querying geospatial data (e.g., GEOMETRY type for municipalities and
         POINT for project coordinates).

  3. Deployment:


  While not explicitly detailed in the provided code, a Next.js application integrated with Supabase would typically be deployed as follows:


   * Frontend Deployment: Next.js applications are commonly deployed to platforms like Vercel (which is the creator of Next.js) or Netlify. These platforms provide
     seamless integration with Git repositories, enabling continuous deployment.
   * Backend Deployment: Supabase handles the deployment and management of the PostgreSQL database, authentication services, and storage. The database schema and
     functions are applied through migrations.


  This comprehensive architecture allows GEOCUBO to provide a powerful, secure, and user-friendly platform for urban development analysis, combining advanced data
  processing with intuitive visualization and strategic planning tools.