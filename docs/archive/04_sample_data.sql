-- GEOCUBO Sample Data
-- Run this script after 01_schema.sql, 02_functions.sql, and 03_policies.sql

-- Insert MCDA Parameters
INSERT INTO mcda_parameters (name, category, weight, min_value, max_value, description) VALUES
-- Context Category (25% total weight)
('Distance to Nearest Town(s)/Villages', 'Context', 8.33, 0, 10, 'Proximity to urban centers and communities'),
('Distance to Main Roads', 'Context', 8.33, 0, 10, 'Accessibility via major transportation routes'),
('Distance to Airport', 'Context', 8.34, 0, 10, 'Proximity to air transportation hubs'),

-- Site Characteristics Category (25% total weight)
('Topography', 'Site Characteristics', 6.25, 0, 10, 'Land slope and terrain suitability'),
('Soil Quality', 'Site Characteristics', 6.25, 0, 10, 'Ground conditions and foundation suitability'),
('Natural Hazards', 'Site Characteristics', 6.25, 0, 10, 'Risk assessment for natural disasters'),
('Environmental Impact', 'Site Characteristics', 6.25, 0, 10, 'Ecological and environmental considerations'),

-- Financial Metrics Category (25% total weight)
('Land Cost', 'Financial Metrics', 8.33, 0, 10, 'Cost of land acquisition'),
('Construction Cost', 'Financial Metrics', 8.33, 0, 10, 'Estimated construction expenses'),
('ROI Potential', 'Financial Metrics', 8.34, 0, 10, 'Return on investment projections'),

-- Social Factors Category (25% total weight)
('Population Density', 'Social Factors', 8.33, 0, 10, 'Local population concentration'),
('Economic Activity', 'Social Factors', 8.33, 0, 10, 'Local economic development level'),
('Infrastructure Quality', 'Social Factors', 8.34, 0, 10, 'Quality of existing infrastructure');

-- Insert sample projects
INSERT INTO projects (id, name, description, location, coordinates, status, asset_class, budget, area_total, units_count, floors_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Torre Reforma Norte', 'Desarrollo residencial de lujo con 120 apartamentos, áreas comunes y vistas panorámicas a la ciudad.', 'Ciudad de Guatemala', POINT(-90.506882, 14.634915), 'active', 'residential', 25000000.00, 12500.00, 120, 25),
('550e8400-e29b-41d4-a716-446655440002', 'Centro Comercial Pradera', 'Centro comercial moderno con tiendas, restaurantes y entretenimiento familiar.', 'Escuintla', POINT(-90.785696, 14.305067), 'planning', 'commercial', 18000000.00, 8500.00, 45, 3),
('550e8400-e29b-41d4-a716-446655440003', 'Complejo Mixto Zona 15', 'Desarrollo de uso mixto con oficinas, comercio y residencias.', 'Ciudad de Guatemala', POINT(-90.489563, 14.599512), 'under_review', 'mixed_use', 35000000.00, 15000.00, 80, 18),
('550e8400-e29b-41d4-a716-446655440004', 'Parque Industrial Amatitlán', 'Complejo industrial para manufactura y logística.', 'Amatitlán', POINT(-90.616667, 14.483333), 'planning', 'industrial', 12000000.00, 25000.00, 15, 4),
('550e8400-e29b-41d4-a716-446655440005', 'Oficinas Corporativas Zona 10', 'Torre de oficinas clase A para empresas multinacionales.', 'Ciudad de Guatemala', POINT(-90.507222, 14.599722), 'active', 'office', 22000000.00, 9800.00, 0, 20),
('550e8400-e29b-41d4-a716-446655440006', 'Hotel Boutique Antigua', 'Hotel boutique de lujo en el centro histórico de Antigua.', 'Antigua Guatemala', POINT(-90.734444, 14.558889), 'completed', 'hospitality', 8500000.00, 3200.00, 35, 4);

-- Insert sample MCDA evaluations for Torre Reforma Norte
INSERT INTO mcda_evaluations (project_id, parameter_id, value, notes) VALUES
-- Context evaluations
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Distance to Nearest Town(s)/Villages'), 9.2, 'Excelente ubicación en zona urbana consolidada'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Distance to Main Roads'), 8.8, 'Acceso directo a principales arterias'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Distance to Airport'), 7.5, 'Distancia moderada al aeropuerto internacional'),

-- Site Characteristics evaluations
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Topography'), 8.5, 'Terreno con pendiente favorable'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Soil Quality'), 9.0, 'Suelo estable para construcción en altura'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Natural Hazards'), 7.8, 'Riesgo sísmico moderado, bien mitigado'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Environmental Impact'), 8.2, 'Impacto ambiental controlado'),

-- Financial Metrics evaluations
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Land Cost'), 6.5, 'Costo de terreno alto pero justificado'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Construction Cost'), 7.8, 'Costos de construcción competitivos'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'ROI Potential'), 9.1, 'Excelente potencial de retorno'),

-- Social Factors evaluations
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Population Density'), 8.7, 'Alta densidad poblacional objetivo'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Economic Activity'), 9.3, 'Zona de alta actividad económica'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM mcda_parameters WHERE name = 'Infrastructure Quality'), 8.9, 'Infraestructura urbana de calidad');

-- Insert sample Business Model Canvas for Torre Reforma Norte
INSERT INTO business_model_canvas (project_id, value_proposition, customer_segments, channels, customer_relationships, revenue_streams, key_resources, key_activities, key_partners, cost_structure) VALUES
('550e8400-e29b-41d4-a716-446655440001', 
'Apartamentos de lujo con vistas panorámicas y amenidades premium para profesionales y familias de alto nivel adquisitivo.',
'Profesionales de 30-55 años, familias de alto nivel adquisitivo, inversionistas inmobiliarios.',
'Ventas directas, agentes inmobiliarios premium, marketing digital dirigido.',
'Atención personalizada, club de propietarios, servicios de conserjería.',
'Venta de unidades, alquiler de espacios comerciales, servicios premium.',
'Ubicación premium, diseño arquitectónico, materiales de alta calidad.',
'Desarrollo inmobiliario, marketing de lujo, gestión de relaciones con clientes.',
'Constructoras de prestigio, diseñadores de interiores, entidades financieras.',
'Adquisición de terreno, construcción, marketing y ventas, gestión de proyecto.');

-- Insert sample municipalities (Guatemala departments)
INSERT INTO municipalities (name, department, country, population, area_km2) VALUES
('Guatemala', 'Guatemala', 'Guatemala', 1000000, 996.0),
('Mixco', 'Guatemala', 'Guatemala', 473080, 132.0),
('Villa Nueva', 'Guatemala', 'Guatemala', 618397, 114.0),
('Petapa', 'Guatemala', 'Guatemala', 141455, 76.0),
('San José Pinula', 'Guatemala', 'Guatemala', 75000, 220.0),
('Escuintla', 'Escuintla', 'Guatemala', 156043, 332.0),
('Antigua Guatemala', 'Sacatepéquez', 'Guatemala', 45669, 78.0),
('Amatitlán', 'Guatemala', 'Guatemala', 114000, 204.0),
('Chimaltenango', 'Chimaltenango', 'Guatemala', 96985, 212.0),
('Quetzaltenango', 'Quetzaltenango', 'Guatemala', 180706, 120.0);

-- Update sequences to avoid conflicts
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects) + 1, false);
SELECT setval('mcda_parameters_id_seq', (SELECT MAX(id) FROM mcda_parameters) + 1, false);
SELECT setval('mcda_evaluations_id_seq', (SELECT MAX(id) FROM mcda_evaluations) + 1, false);
SELECT setval('business_model_canvas_id_seq', (SELECT MAX(id) FROM business_model_canvas) + 1, false);
SELECT setval('municipalities_id_seq', (SELECT MAX(id) FROM municipalities) + 1, false);

