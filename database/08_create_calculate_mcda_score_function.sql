CREATE OR REPLACE FUNCTION calculate_mcda_score(project_uuid UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    total_weighted_score NUMERIC := 0;
    total_weight NUMERIC := 0;
    score NUMERIC;
BEGIN
    -- Calculate the sum of (evaluation_value * parameter_weight) and total weight
    SELECT
        SUM(e.value * p.weight),
        SUM(p.weight)
    INTO
        total_weighted_score,
        total_weight
    FROM
        mcda_evaluations e
    JOIN
        mcda_parameters p ON e.parameter_id = p.id
    WHERE
        e.project_id = project_uuid;

    -- If there are no evaluations or total weight is zero, return NULL or 0
    IF total_weight IS NULL OR total_weight = 0 THEN
        RETURN NULL; -- Or 0, depending on desired behavior for projects without evaluations
    END IF;

    -- Calculate the final score
    score := total_weighted_score / total_weight;

    RETURN score;
END;
$$;