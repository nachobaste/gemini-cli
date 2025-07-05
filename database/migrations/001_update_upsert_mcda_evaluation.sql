CREATE OR REPLACE FUNCTION upsert_mcda_evaluation(
    p_project_id UUID,
    p_parameter_id UUID,
    p_value DECIMAL,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    evaluation_id UUID;
BEGIN
    INSERT INTO mcda_evaluations (project_id, parameter_id, value, notes, evaluated_by)
    VALUES (p_project_id, p_parameter_id, p_value, p_notes, auth.uid())
    ON CONFLICT (project_id, parameter_id)
    DO UPDATE SET 
        value = EXCLUDED.value,
        notes = EXCLUDED.notes,
        evaluated_at = NOW(),
        evaluated_by = auth.uid()
    RETURNING id INTO evaluation_id;
    
    RETURN evaluation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;