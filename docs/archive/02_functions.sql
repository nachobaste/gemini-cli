-- GEOCUBO Database Functions
-- Run this script after 01_schema.sql

-- Function to calculate MCDA score for a project
CREATE OR REPLACE FUNCTION calculate_mcda_score(project_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_score DECIMAL(10,4) := 0;
    category_record RECORD;
    param_record RECORD;
    category_score DECIMAL(10,4);
    category_weight_sum DECIMAL(5,2);
    param_weight_sum DECIMAL(5,2);
BEGIN
    -- Get all categories with their weights
    FOR category_record IN 
        SELECT DISTINCT category, SUM(weight) as total_weight
        FROM mcda_parameters 
        WHERE is_active = true
        GROUP BY category
    LOOP
        category_score := 0;
        param_weight_sum := 0;
        
        -- Calculate score for each parameter in the category
        FOR param_record IN
            SELECT mp.weight, COALESCE(me.value, 0) as param_value
            FROM mcda_parameters mp
            LEFT JOIN mcda_evaluations me ON mp.id = me.parameter_id AND me.project_id = project_uuid
            WHERE mp.category = category_record.category AND mp.is_active = true
        LOOP
            category_score := category_score + (param_record.param_value * param_record.weight / 100);
            param_weight_sum := param_weight_sum + param_record.weight;
        END LOOP;
        
        -- Normalize category score and add to total
        IF param_weight_sum > 0 THEN
            category_score := (category_score / param_weight_sum) * 100;
            total_score := total_score + (category_score * category_record.total_weight / 100);
        END IF;
    END LOOP;
    
    -- Normalize to 0-10 scale
    RETURN ROUND(total_score / 10, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to get project summary with MCDA score
CREATE OR REPLACE FUNCTION get_project_summary(project_uuid UUID)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    location VARCHAR,
    status project_status,
    asset_class asset_class,
    budget DECIMAL,
    area_total DECIMAL,
    units_count INTEGER,
    mcda_score DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.location,
        p.status,
        p.asset_class,
        p.budget,
        p.area_total,
        p.units_count,
        calculate_mcda_score(p.id) as mcda_score,
        p.created_at
    FROM projects p
    WHERE p.id = project_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get all projects with their MCDA scores
CREATE OR REPLACE FUNCTION get_all_projects_with_scores()
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    location VARCHAR,
    status project_status,
    asset_class asset_class,
    budget DECIMAL,
    area_total DECIMAL,
    units_count INTEGER,
    mcda_score DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.location,
        p.status,
        p.asset_class,
        p.budget,
        p.area_total,
        p.units_count,
        calculate_mcda_score(p.id) as mcda_score,
        p.created_at
    FROM projects p
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to update MCDA evaluation
CREATE OR REPLACE FUNCTION upsert_mcda_evaluation(
    p_project_id UUID,
    p_parameter_id UUID,
    p_value DECIMAL,
    p_notes TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    evaluation_id UUID;
BEGIN
    INSERT INTO mcda_evaluations (project_id, parameter_id, value, notes, evaluated_by)
    VALUES (p_project_id, p_parameter_id, p_value, p_notes, p_user_id)
    ON CONFLICT (project_id, parameter_id)
    DO UPDATE SET 
        value = EXCLUDED.value,
        notes = EXCLUDED.notes,
        evaluated_at = NOW(),
        evaluated_by = EXCLUDED.evaluated_by
    RETURNING id INTO evaluation_id;
    
    RETURN evaluation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get MCDA parameters by category
CREATE OR REPLACE FUNCTION get_mcda_parameters_by_category()
RETURNS TABLE (
    category VARCHAR,
    parameters JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.category,
        json_agg(
            json_build_object(
                'id', mp.id,
                'name', mp.name,
                'weight', mp.weight,
                'min_value', mp.min_value,
                'max_value', mp.max_value,
                'description', mp.description
            ) ORDER BY mp.name
        ) as parameters
    FROM mcda_parameters mp
    WHERE mp.is_active = true
    GROUP BY mp.category
    ORDER BY mp.category;
END;
$$ LANGUAGE plpgsql;

-- Function to get project evaluations
CREATE OR REPLACE FUNCTION get_project_evaluations(project_uuid UUID)
RETURNS TABLE (
    parameter_id UUID,
    parameter_name VARCHAR,
    category VARCHAR,
    value DECIMAL,
    weight DECIMAL,
    notes TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.id as parameter_id,
        mp.name as parameter_name,
        mp.category,
        COALESCE(me.value, 0) as value,
        mp.weight,
        me.notes,
        me.evaluated_at
    FROM mcda_parameters mp
    LEFT JOIN mcda_evaluations me ON mp.id = me.parameter_id AND me.project_id = project_uuid
    WHERE mp.is_active = true
    ORDER BY mp.category, mp.name;
END;
$$ LANGUAGE plpgsql;

-- Function to search projects
CREATE OR REPLACE FUNCTION search_projects(
    search_term TEXT DEFAULT NULL,
    status_filter project_status DEFAULT NULL,
    asset_class_filter asset_class DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    location VARCHAR,
    status project_status,
    asset_class asset_class,
    budget DECIMAL,
    mcda_score DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.location,
        p.status,
        p.asset_class,
        p.budget,
        calculate_mcda_score(p.id) as mcda_score,
        p.created_at
    FROM projects p
    WHERE 
        (search_term IS NULL OR 
         p.name ILIKE '%' || search_term || '%' OR 
         p.description ILIKE '%' || search_term || '%' OR
         p.location ILIKE '%' || search_term || '%')
        AND (status_filter IS NULL OR p.status = status_filter)
        AND (asset_class_filter IS NULL OR p.asset_class = asset_class_filter)
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

