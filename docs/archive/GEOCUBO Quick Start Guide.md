# GEOCUBO Quick Start Guide

Welcome to GEOCUBO! This guide will help you get the application running quickly on your local machine and deploy it to production.

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- Git installed
- Supabase account (free)
- VS Code (recommended)

### 2. Clone and Install
```bash
git clone https://github.com/yourusername/geocubo.git
cd geocubo
npm install
```

### 3. Setup Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and API keys from Settings → API
3. Copy `.env.example` to `.env.local` and fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Setup Database
```bash
npm run db:setup
```

This will create all tables, functions, and sample data automatically.

### 5. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Quick Deploy

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --dir=out
```

### Deploy to Railway
```bash
npm install -g @railway/cli
railway login
railway up
```

## 📱 What You Get

- **Interactive Map**: Explore projects with filtering and clustering
- **MCDA Analysis**: 13-parameter evaluation system
- **Business Model Canvas**: Integrated BMC editor
- **Project Management**: Kanban-style project tracking
- **Data Management**: Upload/download Excel templates
- **Responsive Design**: Works on desktop and mobile

## 🔧 Key Features

### Multi-Criteria Decision Analysis (MCDA)
- 4 categories: Context, Site Characteristics, Financial Metrics, Social Factors
- 13 configurable parameters with weights
- Real-time score calculation
- Visual progress indicators

### Business Model Canvas
- 9 sections: Value Proposition, Customer Segments, etc.
- Project-specific business models
- Export capabilities

### Geographic Information System
- Interactive maps with Leaflet
- Project location visualization
- Municipal boundary data for Latin America

### Project Management
- Status tracking (Planning, Active, Under Review, etc.)
- Asset class categorization
- Budget and area management
- File upload and document management

## 📚 Documentation

- [Deployment Guide](./docs/DEPLOYMENT.md) - Comprehensive deployment instructions
- [Development Guide](./docs/DEVELOPMENT.md) - Architecture and development workflow
- [API Documentation](./docs/API.md) - Complete API reference

## 🆘 Need Help?

1. **Check the documentation** in the `/docs` folder
2. **Review sample data** - The setup includes example projects
3. **Check environment variables** - Most issues are configuration-related
4. **Open an issue** on GitHub if you're stuck

## 🎯 Next Steps

1. **Customize MCDA parameters** in the Configuration page
2. **Add your own projects** using the Projects page
3. **Configure authentication** for multi-user access
4. **Set up monitoring** for production deployments
5. **Customize the design** to match your brand

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all secrets
- Enable Row Level Security (RLS) in Supabase
- Set up proper CORS policies for production

## 📊 Sample Data Included

The setup includes:
- 6 sample projects across different asset classes
- Complete MCDA evaluations for one project
- Business Model Canvas example
- Municipal data for Guatemala
- 13 pre-configured MCDA parameters

## 🌍 Regional Scope

GEOCUBO is designed for Latin America but can be adapted for other regions by:
- Updating municipal data in the database
- Adjusting MCDA parameters for local context
- Customizing asset class categories
- Localizing the interface

---

**Ready to build the future of urban development analysis? Let's get started! 🏗️**

