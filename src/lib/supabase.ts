import { createClient } from '@supabase/supabase-js'
import { Project, MCDAParameter, MCDAEvaluation, BusinessModelCanvas, Municipality, UserProfile } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to parse Supabase POINT type to { x: lon, y: lat }
const parsePoint = (point: any): { x: number; y: number } | undefined => {
  if (!point) return undefined;

  // Handle string format like "(lon,lat)"
  if (typeof point === 'string') {
    const match = point.match(/\(([^,]+),([^)]+)\)/);
    if (match) {
      const lon = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      if (!isNaN(lon) && !isNaN(lat)) {
        return { x: lon, y: lat };
      }
    }
  }
  // Handle object format like { x: lon, y: lat } (if Supabase returns it directly)
  else if (typeof point === 'object' && point !== null && typeof point.x === 'number' && typeof point.y === 'number') {
    return { x: point.x, y: point.y };
  }

  return undefined;
};

// Database service functions
export class DatabaseService {
  // Projects
  static async getProjects(assetClass?: string, developmentCategory?: string) {
    let query = supabase
      .from('projects')
      .select('*, mcda_evaluations(*, mcda_parameters(*))')
      .order('created_at', { ascending: false });

    if (assetClass) {
      query = query.eq('asset_class', assetClass);
    }

    if (developmentCategory) {
      query = query.eq('development_category', developmentCategory);
    }

    const { data, error } = await query;
    
    if (error) throw error

    const projectsWithScores = await Promise.all(data.map(async (p) => {
      const score = await DatabaseService.calculateMCDAScore(p.id);
      console.log(`Project ${p.id} MCDA Score:`, score); // Add this line for debugging
      return {
        ...p,
        coordinates: parsePoint(p.coordinates),
        mcda_score: score, // Add the calculated MCDA score
      };
    }));

    return projectsWithScores as Project[];
  }

  static async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, mcda_evaluations(*, mcda_parameters(*)), business_model_canvas(*)')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return {
      ...data,
      coordinates: parsePoint(data.coordinates) // Parse coordinates here
    } as Project
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

  static async updateMCDAParameters(parameters: MCDAParameter[]) {
    const updates = parameters.map(param => ({
      id: param.id,
      weight: param.weight,
    }));

    const { data, error } = await supabase
      .from('mcda_parameters')
      .upsert(updates, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data as MCDAParameter[];
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

  static async getBMCTemplates() {
    const { data, error } = await supabase
      .from('business_model_canvas')
      .select('*')
      .is('project_id', null)

    if (error) throw error
    return data as BusinessModelCanvas[]
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
