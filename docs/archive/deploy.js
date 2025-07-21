#!/usr/bin/env node

/**
 * GEOCUBO Deployment Script
 * 
 * This script handles the deployment process for GEOCUBO to various platforms.
 * 
 * Usage: 
 *   node scripts/deploy.js --platform=vercel
 *   node scripts/deploy.js --platform=netlify
 *   node scripts/deploy.js --platform=railway
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const platform = args.find(arg => arg.startsWith('--platform='))?.split('=')[1];
const environment = args.find(arg => arg.startsWith('--env='))?.split('=')[1] || 'production';

if (!platform) {
  console.error('❌ Platform is required. Use --platform=vercel|netlify|railway');
  process.exit(1);
}

console.log(`🚀 Deploying GEOCUBO to ${platform} (${environment})...\n`);

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const envFile = '.env.local';
  
  if (!fs.existsSync(envFile)) {
    console.error(`❌ Environment file not found: ${envFile}`);
    console.error('Please create .env.local with your Supabase credentials');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  const missingVars = requiredVars.filter(varName => 
    !envContent.includes(varName) || envContent.includes(`${varName}=your_`)
  );
  
  if (missingVars.length > 0) {
    console.error('❌ Missing or incomplete environment variables:');
    missingVars.forEach(varName => console.error(`   ${varName}`));
    console.error('\nPlease update your .env.local file with actual values');
    process.exit(1);
  }
  
  console.log('✅ Environment variables check passed\n');
}

function prebuildChecks() {
  console.log('🔧 Running pre-build checks...');
  
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    runCommand('npm install', 'Installing dependencies');
  }
  
  // Run linting
  try {
    runCommand('npm run lint', 'Running ESLint');
  } catch (error) {
    console.warn('⚠️  Linting failed, continuing anyway...\n');
  }
  
  // Run type checking
  try {
    runCommand('npm run type-check', 'Running TypeScript type check');
  } catch (error) {
    console.warn('⚠️  Type checking failed, continuing anyway...\n');
  }
  
  console.log('✅ Pre-build checks completed\n');
}

function deployToVercel() {
  console.log('🔷 Deploying to Vercel...\n');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    runCommand('npm install -g vercel', 'Installing Vercel CLI');
  }
  
  // Build the application
  runCommand('npm run build', 'Building application');
  
  // Deploy to Vercel
  const deployCommand = environment === 'production' 
    ? 'vercel --prod --yes' 
    : 'vercel --yes';
    
  runCommand(deployCommand, `Deploying to Vercel (${environment})`);
  
  console.log('🎉 Vercel deployment completed!');
  console.log('📝 Don\'t forget to set environment variables in Vercel dashboard');
}

function deployToNetlify() {
  console.log('🔶 Deploying to Netlify...\n');
  
  // Check if Netlify CLI is installed
  try {
    execSync('netlify --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Installing Netlify CLI...');
    runCommand('npm install -g netlify-cli', 'Installing Netlify CLI');
  }
  
  // Build the application for static export
  runCommand('npm run build', 'Building application');
  
  // Deploy to Netlify
  const deployCommand = environment === 'production'
    ? 'netlify deploy --prod --dir=out'
    : 'netlify deploy --dir=out';
    
  runCommand(deployCommand, `Deploying to Netlify (${environment})`);
  
  console.log('🎉 Netlify deployment completed!');
  console.log('📝 Don\'t forget to set environment variables in Netlify dashboard');
}

function deployToRailway() {
  console.log('🚂 Deploying to Railway...\n');
  
  // Check if Railway CLI is installed
  try {
    execSync('railway --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Installing Railway CLI...');
    runCommand('npm install -g @railway/cli', 'Installing Railway CLI');
  }
  
  // Build the application
  runCommand('npm run build', 'Building application');
  
  // Deploy to Railway
  runCommand('railway up', 'Deploying to Railway');
  
  console.log('🎉 Railway deployment completed!');
  console.log('📝 Don\'t forget to set environment variables in Railway dashboard');
}

function postDeploymentChecks() {
  console.log('🔍 Post-deployment recommendations...\n');
  
  console.log('📋 Checklist:');
  console.log('  ☐ Verify environment variables are set correctly');
  console.log('  ☐ Test the deployed application');
  console.log('  ☐ Check database connectivity');
  console.log('  ☐ Verify authentication is working');
  console.log('  ☐ Test MCDA calculations');
  console.log('  ☐ Check map functionality');
  console.log('  ☐ Set up monitoring and alerts');
  console.log('  ☐ Configure custom domain (if needed)');
  console.log('  ☐ Set up SSL certificate');
  console.log('  ☐ Configure CDN (if needed)\n');
  
  console.log('📚 Useful links:');
  console.log('  • Supabase Dashboard: https://app.supabase.com');
  console.log('  • GEOCUBO Documentation: ./docs/');
  console.log('  • Deployment Guide: ./docs/DEPLOYMENT.md');
}

// Main deployment flow
async function deploy() {
  try {
    checkEnvironmentVariables();
    prebuildChecks();
    
    switch (platform) {
      case 'vercel':
        deployToVercel();
        break;
      case 'netlify':
        deployToNetlify();
        break;
      case 'railway':
        deployToRailway();
        break;
      default:
        console.error(`❌ Unsupported platform: ${platform}`);
        console.error('Supported platforms: vercel, netlify, railway');
        process.exit(1);
    }
    
    postDeploymentChecks();
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  deploy();
}

module.exports = { deploy };

