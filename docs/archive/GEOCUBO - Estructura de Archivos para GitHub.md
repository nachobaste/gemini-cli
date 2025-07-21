# GEOCUBO - Estructura de Archivos para GitHub

Esta es la estructura completa de archivos de GEOCUBO preparada para subir a GitHub con VS Code e integración con Supabase.

## 📁 Estructura del Proyecto

```
geocubo/
├── 📄 README.md                    # Documentación principal
├── 📄 QUICKSTART.md               # Guía de inicio rápido
├── 📄 .env.example                # Plantilla de variables de entorno
├── 📄 .gitignore                  # Archivos a ignorar en Git
├── 📄 package.json                # Dependencias y scripts
├── 📄 next.config.js              # Configuración de Next.js
├── 📄 tailwind.config.js          # Configuración de Tailwind CSS
├── 📄 tsconfig.json               # Configuración de TypeScript
├── 📄 postcss.config.js           # Configuración de PostCSS
│
├── 🔧 vercel.json                 # Configuración de Vercel
├── 🔧 netlify.toml                # Configuración de Netlify  
├── 🔧 railway.toml                # Configuración de Railway
│
├── 📂 .github/
│   └── workflows/
│       └── ci-cd.yml              # Pipeline de CI/CD
│
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── layout.tsx             # Layout principal
│   │   ├── page.tsx               # Página de inicio
│   │   ├── globals.css            # Estilos globales
│   │   ├── config/
│   │   │   └── page.tsx           # Página de configuración
│   │   ├── map/
│   │   │   ├── page.tsx           # Explorador de mapas
│   │   │   ├── MapComponent.tsx   # Componente del mapa
│   │   │   └── ComparisonModal.tsx # Modal de comparación
│   │   └── projects/
│   │       ├── page.tsx           # Lista de proyectos
│   │       └── [id]/
│   │           └── page.tsx       # Detalle de proyecto
│   ├── 📂 lib/
│   │   ├── supabase.ts            # Cliente de Supabase
│   │   └── mcda-parameters.ts     # Lógica MCDA
│   ├── 📂 styles/
│   │   └── map-explorer.css       # Estilos del mapa
│   └── 📂 models/
│       └── types.ts               # Tipos TypeScript
│
├── 📂 database/
│   ├── 01_schema.sql              # Esquema de base de datos
│   ├── 02_functions.sql           # Funciones de PostgreSQL
│   ├── 03_policies.sql            # Políticas de seguridad RLS
│   └── 04_sample_data.sql         # Datos de ejemplo
│
├── 📂 scripts/
│   ├── setup-database.js          # Script de configuración de BD
│   └── deploy.js                  # Script de despliegue
│
└── 📂 docs/
    ├── DEPLOYMENT.md              # Guía de despliegue completa
    ├── DEVELOPMENT.md             # Guía de desarrollo
    └── API.md                     # Documentación de API
```

## 🚀 Pasos para Subir a GitHub

### 1. Preparar VS Code
1. Abre VS Code
2. Instala la extensión "GitHub Pull Requests and Issues"
3. Inicia sesión en GitHub desde VS Code

### 2. Crear Repositorio en GitHub
1. Ve a [github.com](https://github.com)
2. Haz clic en "New repository"
3. Nombre: `geocubo`
4. Descripción: "Urban Development Analysis Platform for Latin America"
5. Selecciona "Public" o "Private"
6. NO inicialices con README (ya tenemos uno)
7. Haz clic en "Create repository"

### 3. Subir Archivos desde VS Code
1. Abre VS Code
2. File → Open Folder → Selecciona la carpeta `geocubo-github`
3. Abre la terminal integrada (Ctrl+`)
4. Ejecuta los siguientes comandos:

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: GEOCUBO urban development platform"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/geocubo.git

# Subir a GitHub
git push -u origin main
```

### 4. Configurar Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia las credenciales desde Settings → API
4. Crea `.env.local` basado en `.env.example`
5. Ejecuta: `npm run db:setup`

### 5. Configurar Despliegue (Opcional)
Para Vercel:
```bash
npm install -g vercel
vercel
```

## 📋 Checklist de Verificación

- [ ] ✅ Estructura de archivos completa
- [ ] ✅ Configuración de Supabase incluida
- [ ] ✅ Scripts de base de datos listos
- [ ] ✅ Documentación completa
- [ ] ✅ Configuraciones de despliegue
- [ ] ✅ Pipeline de CI/CD
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Dependencias actualizadas
- [ ] ✅ Archivos de configuración optimizados

## 🔑 Variables de Entorno Requeridas

Después de subir a GitHub, configura estas variables en tu plataforma de despliegue:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

## 🎯 Próximos Pasos

1. **Subir a GitHub**: Sigue los pasos arriba
2. **Configurar Supabase**: Crear proyecto y base de datos
3. **Desplegar**: Usar Vercel, Netlify o Railway
4. **Personalizar**: Ajustar parámetros MCDA según tu región
5. **Documentar**: Agregar información específica de tu implementación

## 📞 Soporte

- 📖 Documentación completa en `/docs/`
- 🚀 Guía rápida en `QUICKSTART.md`
- 🔧 Guía de despliegue en `docs/DEPLOYMENT.md`
- 💻 Guía de desarrollo en `docs/DEVELOPMENT.md`

---

**¡Todo listo para subir a GitHub y desplegar GEOCUBO! 🏗️**

