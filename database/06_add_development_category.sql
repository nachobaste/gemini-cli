CREATE TYPE development_category AS ENUM (
    'land_development',
    'land_packaging',
    'land_banking',
    'real_estate_development',
    'real_estate_operator'
);

ALTER TABLE projects
ADD COLUMN development_category development_category;
