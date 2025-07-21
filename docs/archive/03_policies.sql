-- GEOCUBO Row Level Security Policies
-- Run this script after 01_schema.sql and 02_functions.sql

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcda_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcda_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_model_canvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view all projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = created_by);

-- MCDA Parameters policies (read-only for most users)
CREATE POLICY "Users can view MCDA parameters" ON mcda_parameters
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify MCDA parameters" ON mcda_parameters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- MCDA Evaluations policies
CREATE POLICY "Users can view all evaluations" ON mcda_evaluations
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create evaluations" ON mcda_evaluations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update evaluations for projects they created" ON mcda_evaluations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete evaluations for projects they created" ON mcda_evaluations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_id AND created_by = auth.uid()
        )
    );

-- Business Model Canvas policies
CREATE POLICY "Users can view all BMC" ON business_model_canvas
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create BMC" ON business_model_canvas
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update BMC for projects they created" ON business_model_canvas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete BMC for projects they created" ON business_model_canvas
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_id AND created_by = auth.uid()
        )
    );

-- Municipalities policies (read-only)
CREATE POLICY "Users can view municipalities" ON municipalities
    FOR SELECT USING (true);

-- Project Files policies
CREATE POLICY "Users can view files for projects they can see" ON project_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_id
        )
    );

CREATE POLICY "Users can upload files to projects they created" ON project_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete files from projects they created" ON project_files
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE id = project_id AND created_by = auth.uid()
        )
    );

-- User Profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant specific permissions for storage (if using Supabase Storage)
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);

CREATE POLICY "Users can upload project files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'project-files' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can view project files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'project-files'
    );

CREATE POLICY "Users can delete their uploaded files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'project-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

