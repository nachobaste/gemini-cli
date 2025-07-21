import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Project {
  id: string
  name: string
  description?: string
  location?: string
  coordinates?: { x: number; y: number }
  status: 'planning' | 'active' | 'under_review' | 'suspended' | 'completed'
  asset_class: 'residential' | 'commercial' | 'mixed_use' | 'industrial' | 'office' | 'retail' | 'hospitality'
  budget?: number
  area_total?: number
  units_count?: number
  floors_count?: number
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface MCDAParameter {
  id: string
  name: string
  category: string
  weight: number
  min_value: number
  max_value: number
  description?: string
  is_active: boolean
  created_at: string
}

export interface MCDAEvaluation {
  id: string
  project_id: string
  parameter_id: string
  value: number
  notes?: string
  evaluated_at: string
  evaluated_by?: string
}

export interface BusinessModelCanvas {
  id: string
  project_id: string
  value_proposition?: string
  customer_segments?: string
  channels?: string
  customer_relationships?: string
  revenue_streams?: string
  key_resources?: string
  key_activities?: string
  key_partners?: string
  cost_structure?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface Municipality {
  id: string
  name: string
  department?: string
  country: string
  population?: number
  area_km2?: number
  created_at: string
}

export interface UserProfile {
  id: string
  full_name?: string
  organization?: string
  role?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Database service functions
export class DatabaseService {
  // Projects
  static async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Project[]
  }

  static async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Project
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data as Project
  }

  static async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Project
  }

  static async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // MCDA Parameters
  static async getMCDAParameters() {
    const { data, error } = await supabase
      .from('mcda_parameters')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as MCDAParameter[]
  }

  static async getMCDAParametersByCategory() {
    const { data, error } = await supabase
      .rpc('get_mcda_parameters_by_category')
    
    if (error) throw error
    return data
  }

  // MCDA Evaluations
  static async getProjectEvaluations(projectId: string) {
    const { data, error } = await supabase
      .rpc('get_project_evaluations', { project_uuid: projectId })
    
    if (error) throw error
    return data
  }

  static async upsertMCDAEvaluation(evaluation: {
    project_id: string
    parameter_id: string
    value: number
    notes?: string
  }) {
    const { data, error } = await supabase
      .rpc('upsert_mcda_evaluation', {
        p_project_id: evaluation.project_id,
        p_parameter_id: evaluation.parameter_id,
        p_value: evaluation.value,
        p_notes: evaluation.notes
      })
    
    if (error) throw error
    return data
  }

  static async calculateMCDAScore(projectId: string) {
    const { data, error } = await supabase
      .rpc('calculate_mcda_score', { project_uuid: projectId })
    
    if (error) throw error
    return data as number
  }

  // Business Model Canvas
  static async getBMC(projectId: string) {
    const { data, error } = await supabase
      .from('business_model_canvas')
      .select('*')
      .eq('project_id', projectId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as BusinessModelCanvas | null
  }

  static async upsertBMC(bmc: Omit<BusinessModelCanvas, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('business_model_canvas')
      .upsert(bmc)
      .select()
      .single()
    
    if (error) throw error
    return data as BusinessModelCanvas
  }

  // Municipalities
  static async getMunicipalities() {
    const { data, error } = await supabase
      .from('municipalities')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Municipality[]
  }

  // Search
  static async searchProjects(searchTerm?: string, status?: string, assetClass?: string) {
    const { data, error } = await supabase
      .rpc('search_projects', {
        search_term: searchTerm,
        status_filter: status,
        asset_class_filter: assetClass
      })
    
    if (error) throw error
    return data
  }

  // User Profile
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as UserProfile | null
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...updates })
      .select()
      .single()
    
    if (error) throw error
    return data as UserProfile
  }
}

