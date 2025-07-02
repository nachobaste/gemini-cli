CREATE OR REPLACE FUNCTION upsert_mcda_evaluation(
    p_project_id UUID,
    p_parameter_id UUID,
    p_value NUMERIC,
    p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO mcda_evaluations (project_id, parameter_id, value, notes)
    VALUES (p_project_id, p_parameter_id, p_value, p_notes)
    ON CONFLICT (project_id, parameter_id) DO UPDATE
    SET
        value = EXCLUDED.value,
        notes = EXCLUDED.notes,
        evaluated_at = NOW();
END;
$$;