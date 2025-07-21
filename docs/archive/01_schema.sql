-- GEOCUBO Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE project_status AS ENUM ('planning', 'active', 'under_review', 'suspended', 'completed');
CREATE TYPE asset_class AS ENUM ('residential', 'commercial', 'mixed_use', 'industrial', 'office', 'retail', 'hospitality');

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    coordinates POINT,
    status project_status DEFAULT 'planning',
    asset_class asset_class NOT NULL,
    budget DECIMAL(15,2),
    area_total DECIMAL(10,2), -- in square meters
    units_count INTEGER,
    floors_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- MCDA Parameters table
CREATE TABLE mcda_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    weight DECIMAL(5,2) DEFAULT 0.00, -- percentage weight
    min_value DECIMAL(10,2) DEFAULT 0,
    max_value DECIMAL(10,2) DEFAULT 10,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MCDA Evaluations table
CREATE TABLE mcda_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parameter_id UUID REFERENCES mcda_parameters(id),
    value DECIMAL(10,2) NOT NULL,
    notes TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    evaluated_by UUID REFERENCES auth.users(id),
    UNIQUE(project_id, parameter_id)
);

-- Business Model Canvas table
CREATE TABLE business_model_canvas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    value_proposition TEXT,
    customer_segments TEXT,
    channels TEXT,
    customer_relationships TEXT,
    revenue_streams TEXT,
    key_resources TEXT,
    key_activities TEXT,
    key_partners TEXT,
    cost_structure TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Municipalities table (for GIS data)
CREATE TABLE municipalities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    country VARCHAR(100) DEFAULT 'Guatemala',
    geometry GEOMETRY(MULTIPOLYGON, 4326),
    population INTEGER,
    area_km2 DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Files table (for document management)
CREATE TABLE project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    organization VARCHAR(255),
    role VARCHAR(100),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_asset_class ON projects(asset_class);
CREATE INDEX idx_projects_location ON projects USING GIST(coordinates);
CREATE INDEX idx_mcda_evaluations_project ON mcda_evaluations(project_id);
CREATE INDEX idx_mcda_evaluations_parameter ON mcda_evaluations(parameter_id);
CREATE INDEX idx_project_files_project ON project_files(project_id);
CREATE INDEX idx_municipalities_geometry ON municipalities USING GIST(geometry);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_model_canvas_updated_at BEFORE UPDATE ON business_model_canvas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

