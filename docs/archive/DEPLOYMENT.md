# GEOCUBO Deployment Guide

This comprehensive guide will walk you through deploying GEOCUBO from development to production using Supabase as your database and various hosting platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development Setup](#local-development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Deployment Options](#deployment-options)
7. [Production Configuration](#production-configuration)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed and configured:

### Required Software
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **npm or yarn**: Comes with Node.js
- **Git**: Download from [git-scm.com](https://git-scm.com/)
- **VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/)

### Required Accounts
- **GitHub Account**: For version control and repository hosting
- **Supabase Account**: For database and backend services
- **Vercel Account** (recommended): For frontend deployment
- **Domain Provider** (optional): For custom domain

### VS Code Extensions (Recommended)
Install these extensions for the best development experience:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- GitLens
- Prettier - Code formatter
- ESLint

## Supabase Setup

### Step 1: Create a New Supabase Project

1. **Sign up/Login to Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign in with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - **Name**: `geocubo-production` (or your preferred name)
     - **Database Password**: Generate a strong password and save it securely
     - **Region**: Choose the region closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see a progress indicator

### Step 2: Configure Project Settings

1. **Access Project Settings**
   - Go to Settings → General
   - Note your project URL and API keys

2. **Configure Authentication**
   - Go to Authentication → Settings
   - Configure your site URL: `https://yourdomain.com`
   - Add redirect URLs for development: `http://localhost:3000`

3. **Set Up Storage (Optional)**
   - Go to Storage
   - Create a bucket named `project-files`
   - Configure public access policies as needed

### Step 3: Database Configuration

1. **Access SQL Editor**
   - Go to SQL Editor in your Supabase dashboard
   - You'll run the provided SQL scripts here

2. **Enable Required Extensions**
   ```sql
   -- Enable PostGIS for geographic data
   CREATE EXTENSION IF NOT EXISTS "postgis";
   
   -- Enable UUID generation
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

## Local Development Setup

### Step 1: Clone and Setup Repository

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/geocubo.git
   cd geocubo
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```

### Step 2: Configure Environment Variables

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=GEOCUBO

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

**Finding Your Supabase Keys:**
1. Go to your Supabase project dashboard
2. Click Settings → API
3. Copy the Project URL and anon/public key
4. Copy the service_role key (keep this secret!)

## Database Setup

### Step 1: Run Database Scripts

Execute the following scripts in your Supabase SQL Editor in order:

1. **Schema Creation** (`database/01_schema.sql`)
   - Creates all tables and relationships
   - Sets up data types and constraints
   - Establishes indexes for performance

2. **Functions** (`database/02_functions.sql`)
   - Creates stored procedures for MCDA calculations
   - Sets up search and aggregation functions
   - Implements business logic in the database

3. **Security Policies** (`database/03_policies.sql`)
   - Enables Row Level Security (RLS)
   - Creates access policies for each table
   - Sets up user authentication rules

4. **Sample Data** (`database/04_sample_data.sql`)
   - Inserts MCDA parameters
   - Creates sample projects
   - Provides test data for development

### Step 2: Verify Database Setup

1. **Check Tables**
   - Go to Table Editor in Supabase
   - Verify all tables are created
   - Check that sample data is present

2. **Test Functions**
   ```sql
   -- Test MCDA calculation
   SELECT calculate_mcda_score('550e8400-e29b-41d4-a716-446655440001');
   
   -- Test project search
   SELECT * FROM search_projects('Torre');
   ```

3. **Verify RLS Policies**
   - Go to Authentication → Policies
   - Ensure all tables have appropriate policies

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and excellent performance.

#### Setup Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Local**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose your team/account
   - Set project name
   - Configure build settings (usually auto-detected)

4. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add all variables from your `.env.local`

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Automatic Deployments

1. **Connect GitHub Repository**
   - Go to Vercel dashboard
   - Click "Import Project"
   - Connect your GitHub repository
   - Configure build settings

2. **Configure Branch Deployments**
   - Production: `main` branch
   - Preview: `develop` branch
   - Feature branches: automatic preview deployments

### Option 2: Netlify

1. **Build the Application**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to Netlify**
   - Drag and drop the `out` folder to Netlify
   - Or connect your GitHub repository

3. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables

### Option 3: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Configure Environment Variables**
   ```bash
   railway variables set NEXT_PUBLIC_SUPABASE_URL=your-url
   railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

## Production Configuration

### Step 1: Update Supabase Settings

1. **Update Site URL**
   - Go to Authentication → Settings
   - Update Site URL to your production domain
   - Add production URL to redirect URLs

2. **Configure CORS**
   - Ensure your production domain is allowed
   - Remove localhost URLs from production

3. **Review Security Policies**
   - Audit RLS policies for production use
   - Ensure proper access controls

### Step 2: Performance Optimization

1. **Enable Caching**
   ```javascript
   // next.config.js
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 's-maxage=60, stale-while-revalidate'
             }
           ]
         }
       ]
     }
   }
   ```

2. **Optimize Images**
   - Configure Next.js Image Optimization
   - Set up proper domains in next.config.js
   - Use WebP format when possible

3. **Database Optimization**
   - Monitor query performance in Supabase
   - Add indexes for frequently queried columns
   - Use database functions for complex operations

### Step 3: Monitoring Setup

1. **Supabase Monitoring**
   - Enable database monitoring
   - Set up alerts for high usage
   - Monitor API usage and limits

2. **Application Monitoring**
   - Set up Google Analytics (optional)
   - Configure error tracking (Sentry recommended)
   - Monitor Core Web Vitals

3. **Uptime Monitoring**
   - Use services like UptimeRobot
   - Monitor both frontend and API endpoints
   - Set up alerts for downtime

## Security Considerations

### Database Security

1. **Row Level Security**
   - Ensure RLS is enabled on all tables
   - Test policies with different user roles
   - Regularly audit access patterns

2. **API Keys Management**
   - Never expose service role keys in frontend
   - Rotate keys periodically
   - Use environment variables for all secrets

3. **Data Validation**
   - Validate all inputs on both client and server
   - Use TypeScript for type safety
   - Implement proper error handling

### Application Security

1. **Authentication**
   - Use Supabase Auth for user management
   - Implement proper session handling
   - Set up password policies

2. **HTTPS Configuration**
   - Ensure all traffic uses HTTPS
   - Configure proper SSL certificates
   - Set up security headers

3. **Content Security Policy**
   ```javascript
   // next.config.js
   const securityHeaders = [
     {
       key: 'X-DNS-Prefetch-Control',
       value: 'on'
     },
     {
       key: 'Strict-Transport-Security',
       value: 'max-age=63072000; includeSubDomains; preload'
     },
     {
       key: 'X-XSS-Protection',
       value: '1; mode=block'
     }
   ]
   ```

## Backup and Recovery

### Database Backups

1. **Automatic Backups**
   - Supabase provides automatic daily backups
   - Backups are retained for 7 days on free tier
   - Upgrade to Pro for longer retention

2. **Manual Backups**
   ```bash
   # Export specific tables
   pg_dump --host=db.your-project.supabase.co \
           --port=5432 \
           --username=postgres \
           --dbname=postgres \
           --table=projects \
           --data-only > projects_backup.sql
   ```

3. **Backup Strategy**
   - Schedule regular exports of critical data
   - Store backups in multiple locations
   - Test restore procedures regularly

### Application Backups

1. **Code Repository**
   - Ensure all code is in version control
   - Use protected branches for production
   - Tag releases for easy rollback

2. **Configuration Backups**
   - Document all environment variables
   - Keep deployment configurations in version control
   - Maintain infrastructure as code

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```
   Error: Invalid API key
   ```
   **Solution**: Verify your Supabase URL and API keys in environment variables

2. **Build Failures**
   ```
   Error: Module not found
   ```
   **Solution**: Run `npm install` to ensure all dependencies are installed

3. **Authentication Issues**
   ```
   Error: Invalid redirect URL
   ```
   **Solution**: Check that your domain is added to Supabase Auth settings

4. **Performance Issues**
   - Check database query performance in Supabase dashboard
   - Monitor API response times
   - Optimize images and static assets

### Debug Mode

Enable debug mode for detailed logging:

```env
# .env.local
DEBUG=true
NODE_ENV=development
```

### Getting Help

1. **Documentation**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [Supabase Documentation](https://supabase.com/docs)
   - [Vercel Documentation](https://vercel.com/docs)

2. **Community Support**
   - [GEOCUBO GitHub Issues](https://github.com/yourusername/geocubo/issues)
   - [Supabase Discord](https://discord.supabase.com/)
   - [Next.js Discussions](https://github.com/vercel/next.js/discussions)

3. **Professional Support**
   - Contact the GEOCUBO team for enterprise support
   - Consider Supabase Pro for priority support
   - Vercel Pro includes enhanced support

---

This deployment guide provides a comprehensive foundation for getting GEOCUBO running in production. Follow each step carefully and don't hesitate to reach out for support if you encounter any issues.

