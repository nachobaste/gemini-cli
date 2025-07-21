# GEOCUBO - Urban Development Analysis Platform

GEOCUBO is a comprehensive urban development analysis platform designed for Latin America, providing advanced tools for project evaluation, multi-criteria decision analysis (MCDA), and business model canvas development.

## 🚀 Features

- **Interactive Map Explorer**: Visualize projects with advanced filtering and geospatial analysis
- **MCDA Engine**: Multi-criteria decision analysis with 13 customizable parameters
- **Business Model Canvas**: Integrated BMC tool for project planning
- **Project Management**: Kanban-style project tracking and management
- **Data Management**: Upload/download capabilities for project data
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet with React-Leaflet
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/geocubo.git
   cd geocubo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Setup

The application uses Supabase as the backend. Run the provided SQL scripts to set up the database schema:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the scripts in `/database/` folder in order:
   - `01_schema.sql`
   - `02_functions.sql`
   - `03_policies.sql`
   - `04_sample_data.sql`

## 🌍 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Add all variables from `.env.local`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📁 Project Structure

```
geocubo/
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── (pages)/        # Route groups
│   │   ├── api/            # API routes
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   ├── lib/               # Utilities and configurations
│   ├── models/            # TypeScript interfaces
│   └── types/             # Type definitions
├── database/              # Database schema and migrations
├── docs/                  # Documentation
├── public/               # Static assets
└── README.md
```

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=GEOCUBO

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📖 API Documentation

The application provides RESTful APIs for:

- **Projects**: CRUD operations for urban development projects
- **MCDA**: Multi-criteria decision analysis calculations
- **BMC**: Business model canvas data management
- **GIS**: Geographic information system data

API documentation is available at `/api/docs` when running in development mode.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@geocubo.com
- 📖 Documentation: [docs.geocubo.com](https://docs.geocubo.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/geocubo/issues)

## 🗺 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Real-time collaboration features
- [ ] Mobile application
- [ ] Integration with GIS platforms
- [ ] Machine learning predictions
- [ ] Multi-language support

---

Built with ❤️ for urban development in Latin America

