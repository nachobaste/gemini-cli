// Type definitions for GEOCUBO application

export interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  coordinates?: {
    x: number;
    y: number;
  };
  status: ProjectStatus;
  asset_class: AssetClass;
  budget?: number;
  area_total?: number;
  units_count?: number;
  floors_count?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export type ProjectStatus = 'planning' | 'active' | 'under_review' | 'suspended' | 'completed';

export type AssetClass = 'residential' | 'commercial' | 'mixed_use' | 'industrial' | 'office' | 'retail' | 'hospitality';

export interface MCDAParameter {
  id: string;
  name: string;
  category: string;
  weight: number;
  min_value: number;
  max_value: number;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface MCDAEvaluation {
  id: string;
  project_id: string;
  parameter_id: string;
  value: number;
  notes?: string;
  evaluated_at: string;
  evaluated_by?: string;
}

export interface MCDAEvaluationWithDetails extends MCDAEvaluation {
  parameter_name: string;
  category: string;
  weight: number;
}

export interface BusinessModelCanvas {
  id?: string;
  project_id: string;
  value_proposition?: string;
  customer_segments?: string;
  channels?: string;
  customer_relationships?: string;
  revenue_streams?: string;
  key_resources?: string;
  key_activities?: string;
  key_partners?: string;
  cost_structure?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface Municipality {
  id: string;
  name: string;
  department?: string;
  country: string;
  population?: number;
  area_km2?: number;
  geometry?: GeoJSON.GeoJSON;
  created_at: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  recordsProcessed?: number;
  errors?: string[];
}

export interface MCDACategory {
  id: string;
  name: string;
  weight: number;
  parameters: MCDAParameter[];
}

export interface ProjectFilter {
  status?: ProjectStatus[];
  asset_class?: AssetClass[];
  search?: string;
  budget_min?: number;
  budget_max?: number;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  project: Project;
  mcdaScore?: number;
}

export interface ComparisonProject {
  project: Project;
  mcdaScore: number;
  evaluations: MCDAEvaluationWithDetails[];
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface ProjectFormData {
  name: string;
  description?: string;
  location?: string;
  coordinates?: {
    x: number;
    y: number;
  };
  status: ProjectStatus;
  asset_class: AssetClass;
  budget?: number;
  area_total?: number;
  units_count?: number;
  floors_count?: number;
}

export interface MCDAEvaluationFormData {
  parameter_id: string;
  value: number;
  notes?: string;
}

// Utility types
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: keyof Project;
  direction: SortDirection;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

// Component prop types
export interface ProjectCardProps {
  project: Project;
  mcdaScore?: number;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onView?: (project: Project) => void;
}

export interface MCDAParameterCardProps {
  parameter: MCDAParameter;
  evaluation?: MCDAEvaluation;
  onEvaluate?: (parameterId: string, value: number, notes?: string) => void;
}

export interface BusinessModelCanvasProps {
  canvas: BusinessModelCanvas;
  onUpdate?: (canvas: Partial<BusinessModelCanvas>) => void;
  readOnly?: boolean;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface MCDAScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface AssetClassDistribution {
  asset_class: AssetClass;
  count: number;
  percentage: number;
  average_score?: number;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

// User types (for future authentication)
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user' | 'viewer';
  created_at: string;
  last_login?: string;
}

export interface UserSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

// Configuration types
export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  features: {
    authentication: boolean;
    multiTenant: boolean;
    realTimeUpdates: boolean;
  };
  ui: {
    theme: ThemeConfig;
    language: string;
    dateFormat: string;
    currencyFormat: string;
  };
}

// Export utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

