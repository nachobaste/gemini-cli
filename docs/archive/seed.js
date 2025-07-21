#!/usr/bin/env node

/**
 * GEOCUBO Database Seeding Script
 * 
 * This script populates the database with sample data for development
 * and testing purposes.
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed MCDA parameters
    console.log('📊 Seeding MCDA parameters...');
    const { error: paramsError } = await supabase
      .from('mcda_parameters')
      .upsert([
        {
          id: '1',
          name: 'Distance to Towns',
          category: 'Context',
          weight: 15,
          min_value: 0,
          max_value: 10,
          description: 'Proximity to urban centers and towns',
          is_active: true
        },
        {
          id: '2',
          name: 'Infrastructure Access',
          category: 'Context',
          weight: 20,
          min_value: 0,
          max_value: 10,
          description: 'Access to roads, utilities, and services',
          is_active: true
        },
        {
          id: '3',
          name: 'Market Demand',
          category: 'Financial',
          weight: 25,
          min_value: 0,
          max_value: 10,
          description: 'Local market demand for the asset class',
          is_active: true
        },
        {
          id: '4',
          name: 'ROI Potential',
          category: 'Financial',
          weight: 20,
          min_value: 0,
          max_value: 10,
          description: 'Expected return on investment',
          is_active: true
        },
        {
          id: '5',
          name: 'Environmental Impact',
          category: 'Environmental',
          weight: 10,
          min_value: 0,
          max_value: 10,
          description: 'Environmental sustainability factors',
          is_active: true
        },
        {
          id: '6',
          name: 'Regulatory Compliance',
          category: 'Legal',
          weight: 10,
          min_value: 0,
          max_value: 10,
          description: 'Compliance with local regulations',
          is_active: true
        }
      ], { onConflict: 'id' });

    if (paramsError) throw paramsError;

    // Seed sample projects
    console.log('🏗️  Seeding sample projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .upsert([
        {
          id: '1',
          name: 'Torre Reforma Norte',
          description: 'Mixed-use development in Guatemala City',
          location: 'Guatemala City, Guatemala',
          coordinates: { x: -90.5069, y: 14.6349 },
          status: 'active',
          asset_class: 'mixed_use',
          budget: 25000000,
          area_total: 12500,
          units_count: 120,
          floors_count: 25
        },
        {
          id: '2',
          name: 'Residencial Las Flores',
          description: 'Residential complex in Antigua',
          location: 'Antigua Guatemala, Guatemala',
          coordinates: { x: -90.7346, y: 14.5586 },
          status: 'planning',
          asset_class: 'residential',
          budget: 8500000,
          area_total: 5200,
          units_count: 45,
          floors_count: 3
        },
        {
          id: '3',
          name: 'Centro Comercial Pacífico',
          description: 'Shopping center in Escuintla',
          location: 'Escuintla, Guatemala',
          coordinates: { x: -90.7849, y: 14.3058 },
          status: 'under_review',
          asset_class: 'commercial',
          budget: 15000000,
          area_total: 8500,
          units_count: 80,
          floors_count: 2
        }
      ], { onConflict: 'id' });

    if (projectsError) throw projectsError;

    // Seed MCDA evaluations for sample projects
    console.log('📈 Seeding MCDA evaluations...');
    const evaluations = [];
    
    // Project 1 evaluations
    evaluations.push(
      { project_id: '1', parameter_id: '1', value: 8.5, notes: 'Excellent urban location' },
      { project_id: '1', parameter_id: '2', value: 9.0, notes: 'Full infrastructure available' },
      { project_id: '1', parameter_id: '3', value: 8.0, notes: 'High demand for mixed-use' },
      { project_id: '1', parameter_id: '4', value: 7.5, notes: 'Good ROI expected' },
      { project_id: '1', parameter_id: '5', value: 6.0, notes: 'Standard environmental measures' },
      { project_id: '1', parameter_id: '6', value: 9.0, notes: 'All permits obtained' }
    );

    // Project 2 evaluations
    evaluations.push(
      { project_id: '2', parameter_id: '1', value: 7.0, notes: 'Good proximity to Antigua' },
      { project_id: '2', parameter_id: '2', value: 6.5, notes: 'Some infrastructure upgrades needed' },
      { project_id: '2', parameter_id: '3', value: 8.5, notes: 'High residential demand' },
      { project_id: '2', parameter_id: '4', value: 8.0, notes: 'Strong ROI potential' },
      { project_id: '2', parameter_id: '5', value: 8.5, notes: 'Eco-friendly design' },
      { project_id: '2', parameter_id: '6', value: 7.5, notes: 'Most permits in progress' }
    );

    // Project 3 evaluations
    evaluations.push(
      { project_id: '3', parameter_id: '1', value: 6.0, notes: 'Moderate urban access' },
      { project_id: '3', parameter_id: '2', value: 7.0, notes: 'Good highway access' },
      { project_id: '3', parameter_id: '3', value: 7.5, notes: 'Growing commercial demand' },
      { project_id: '3', parameter_id: '4', value: 6.5, notes: 'Moderate ROI expected' },
      { project_id: '3', parameter_id: '5', value: 7.0, notes: 'Standard compliance' },
      { project_id: '3', parameter_id: '6', value: 8.0, notes: 'Commercial permits ready' }
    );

    const { error: evaluationsError } = await supabase
      .from('mcda_evaluations')
      .upsert(evaluations, { onConflict: 'project_id,parameter_id' });

    if (evaluationsError) throw evaluationsError;

    // Seed sample municipalities
    console.log('🗺️  Seeding municipalities...');
    const { error: municipalitiesError } = await supabase
      .from('municipalities')
      .upsert([
        {
          id: '1',
          name: 'Guatemala',
          department: 'Guatemala',
          country: 'Guatemala',
          population: 1022000
        },
        {
          id: '2',
          name: 'Antigua Guatemala',
          department: 'Sacatepéquez',
          country: 'Guatemala',
          population: 45669
        },
        {
          id: '3',
          name: 'Escuintla',
          department: 'Escuintla',
          country: 'Guatemala',
          population: 103165
        }
      ], { onConflict: 'id' });

    if (municipalitiesError) throw municipalitiesError;

    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Seeded data:');
    console.log('   - 6 MCDA parameters');
    console.log('   - 3 sample projects');
    console.log('   - 18 MCDA evaluations');
    console.log('   - 3 municipalities');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
GEOCUBO Database Seeding Script

Usage:
  node scripts/seed.js [options]

Options:
  --help, -h     Show this help message
  --clear        Clear existing data before seeding

Environment Variables:
  NEXT_PUBLIC_SUPABASE_URL      Your Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY     Your Supabase service role key
`);
  process.exit(0);
}

if (args.includes('--clear')) {
  console.log('🗑️  Clearing existing data...');
  // Add clearing logic here if needed
}

// Run seeding
seedDatabase().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});

