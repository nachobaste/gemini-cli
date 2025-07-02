CREATE TABLE bmc_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_class TEXT NOT NULL UNIQUE,
    value_proposition TEXT,
    customer_segments TEXT,
    channels TEXT,
    customer_relationships TEXT,
    revenue_streams TEXT,
    key_resources TEXT,
    key_activities TEXT,
    key_partners TEXT,
    cost_structure TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO bmc_templates (asset_class, value_proposition, customer_segments, channels, customer_relationships, revenue_streams, key_resources, key_activities, key_partners, cost_structure)
VALUES
('residential', 'Modern and affordable housing solutions for young families.', 'Young families, first-time homebuyers.', 'Online listings, real estate agents.', 'Personalized support, community events.', 'Apartment sales, rental income.', 'Land, construction permits, development team.', 'Construction, marketing, sales.', 'Construction companies, banks, real estate agencies.', 'Construction costs, marketing expenses, salaries.'),
('commercial', 'High-traffic retail spaces in prime locations.', 'Retail businesses, restaurants, cafes.', 'Direct sales, commercial real estate brokers.', 'Long-term leases, property management services.', 'Rental income, maintenance fees.', 'Commercial properties, property management team.', 'Property acquisition, leasing, maintenance.', 'Property owners, maintenance companies, marketing agencies.', 'Property acquisition costs, maintenance costs, marketing expenses.');
