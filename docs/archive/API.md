# GEOCUBO API Documentation

This document provides comprehensive documentation for the GEOCUBO API, including endpoints, data models, authentication, and usage examples.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Data Models](#data-models)
4. [Endpoints](#endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)
8. [SDKs and Libraries](#sdks-and-libraries)

## Overview

The GEOCUBO API is built on Supabase, providing a RESTful interface for managing urban development projects, MCDA evaluations, and business model canvas data. The API supports real-time subscriptions and follows REST conventions.

### Base URL
```
https://your-project.supabase.co/rest/v1/
```

### Content Type
All requests and responses use JSON format:
```
Content-Type: application/json
```

### API Versioning
The API uses URL versioning. The current version is `v1`.

## Authentication

GEOCUBO uses Supabase Auth for authentication and authorization.

### Authentication Methods

1. **API Key Authentication** (for public data)
2. **JWT Token Authentication** (for user-specific data)
3. **Service Role Key** (for administrative operations)

### Headers

#### Public Access
```http
apikey: your_supabase_anon_key
```

#### Authenticated Access
```http
apikey: your_supabase_anon_key
Authorization: Bearer your_jwt_token
```

#### Administrative Access
```http
apikey: your_supabase_service_role_key
Authorization: Bearer your_service_role_key
```

### Getting JWT Token

```javascript
import { supabase } from './lib/supabase';

// Sign in user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Use the access token
const token = data.session?.access_token;
```

## Data Models

### Project

```typescript
interface Project {
  id: string;                    // UUID primary key
  name: string;                  // Project name
  description?: string;          // Project description
  location?: string;             // Location name
  coordinates?: Point;           // Geographic coordinates
  status: ProjectStatus;         // Project status
  asset_class: AssetClass;       // Asset classification
  budget?: number;               // Project budget in USD
  area_total?: number;           // Total area in square meters
  units_count?: number;          // Number of units
  floors_count?: number;         // Number of floors
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
  created_by?: string;           // User ID
  updated_by?: string;           // User ID
}

type ProjectStatus = 'planning' | 'active' | 'under_review' | 'suspended' | 'completed';
type AssetClass = 'residential' | 'commercial' | 'mixed_use' | 'industrial' | 'office' | 'retail' | 'hospitality';
```

### MCDA Parameter

```typescript
interface MCDAParameter {
  id: string;                    // UUID primary key
  name: string;                  // Parameter name
  category: string;              // Parameter category
  weight: number;                // Weight percentage (0-100)
  min_value: number;             // Minimum value
  max_value: number;             // Maximum value
  description?: string;          // Parameter description
  is_active: boolean;            // Whether parameter is active
  created_at: string;            // ISO timestamp
}
```

### MCDA Evaluation

```typescript
interface MCDAEvaluation {
  id: string;                    // UUID primary key
  project_id: string;            // Foreign key to projects
  parameter_id: string;          // Foreign key to mcda_parameters
  value: number;                 // Evaluation value
  notes?: string;                // Evaluation notes
  evaluated_at: string;          // ISO timestamp
  evaluated_by?: string;         // User ID
}
```

### Business Model Canvas

```typescript
interface BusinessModelCanvas {
  id: string;                    // UUID primary key
  project_id: string;            // Foreign key to projects (unique)
  value_proposition?: string;    // Value proposition
  customer_segments?: string;    // Customer segments
  channels?: string;             // Channels
  customer_relationships?: string; // Customer relationships
  revenue_streams?: string;      // Revenue streams
  key_resources?: string;        // Key resources
  key_activities?: string;       // Key activities
  key_partners?: string;         // Key partners
  cost_structure?: string;       // Cost structure
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
  created_by?: string;           // User ID
  updated_by?: string;           // User ID
}
```

### Municipality

```typescript
interface Municipality {
  id: string;                    // UUID primary key
  name: string;                  // Municipality name
  department?: string;           // Department/state
  country: string;               // Country
  population?: number;           // Population count
  area_km2?: number;             // Area in square kilometers
  geometry?: GeoJSON;            // Geographic boundaries
  created_at: string;            // ISO timestamp
}
```

## Endpoints

### Projects

#### List Projects
```http
GET /projects
```

**Query Parameters:**
- `select`: Columns to select (default: `*`)
- `order`: Ordering (e.g., `created_at.desc`)
- `limit`: Number of results (default: 100)
- `offset`: Pagination offset

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Torre Reforma Norte",
    "description": "Luxury residential development",
    "location": "Ciudad de Guatemala",
    "status": "active",
    "asset_class": "residential",
    "budget": 25000000,
    "area_total": 12500,
    "units_count": 120,
    "floors_count": 25,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Project
```http
GET /projects?id=eq.{project_id}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Torre Reforma Norte",
  "description": "Luxury residential development",
  "location": "Ciudad de Guatemala",
  "coordinates": {
    "x": -90.506882,
    "y": 14.634915
  },
  "status": "active",
  "asset_class": "residential",
  "budget": 25000000,
  "area_total": 12500,
  "units_count": 120,
  "floors_count": 25,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Create Project
```http
POST /projects
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "location": "Guatemala City",
  "status": "planning",
  "asset_class": "residential",
  "budget": 15000000,
  "area_total": 8000,
  "units_count": 80
}
```

**Response:**
```json
{
  "id": "new-project-uuid",
  "name": "New Project",
  "description": "Project description",
  "location": "Guatemala City",
  "status": "planning",
  "asset_class": "residential",
  "budget": 15000000,
  "area_total": 8000,
  "units_count": 80,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Update Project
```http
PATCH /projects?id=eq.{project_id}
```

**Request Body:**
```json
{
  "status": "active",
  "budget": 16000000
}
```

#### Delete Project
```http
DELETE /projects?id=eq.{project_id}
```

### MCDA Operations

#### Get MCDA Parameters
```http
GET /mcda_parameters?is_active=eq.true
```

**Response:**
```json
[
  {
    "id": "param-uuid-1",
    "name": "Distance to Nearest Town(s)/Villages",
    "category": "Context",
    "weight": 8.33,
    "min_value": 0,
    "max_value": 10,
    "description": "Proximity to urban centers",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Parameters by Category
```http
POST /rpc/get_mcda_parameters_by_category
```

**Response:**
```json
[
  {
    "category": "Context",
    "parameters": [
      {
        "id": "param-uuid-1",
        "name": "Distance to Nearest Town(s)/Villages",
        "weight": 8.33,
        "min_value": 0,
        "max_value": 10,
        "description": "Proximity to urban centers"
      }
    ]
  }
]
```

#### Get Project Evaluations
```http
POST /rpc/get_project_evaluations
```

**Request Body:**
```json
{
  "project_uuid": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response:**
```json
[
  {
    "parameter_id": "param-uuid-1",
    "parameter_name": "Distance to Nearest Town(s)/Villages",
    "category": "Context",
    "value": 9.2,
    "weight": 8.33,
    "notes": "Excellent urban location",
    "evaluated_at": "2024-01-15T10:30:00Z"
  }
]
```

#### Calculate MCDA Score
```http
POST /rpc/calculate_mcda_score
```

**Request Body:**
```json
{
  "project_uuid": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response:**
```json
8.75
```

#### Update MCDA Evaluation
```http
POST /rpc/upsert_mcda_evaluation
```

**Request Body:**
```json
{
  "p_project_id": "550e8400-e29b-41d4-a716-446655440001",
  "p_parameter_id": "param-uuid-1",
  "p_value": 9.5,
  "p_notes": "Updated evaluation"
}
```

**Response:**
```json
"evaluation-uuid"
```

### Business Model Canvas

#### Get BMC
```http
GET /business_model_canvas?project_id=eq.{project_id}
```

**Response:**
```json
{
  "id": "bmc-uuid",
  "project_id": "550e8400-e29b-41d4-a716-446655440001",
  "value_proposition": "Luxury apartments with panoramic views",
  "customer_segments": "High-income professionals and families",
  "channels": "Direct sales, premium real estate agents",
  "customer_relationships": "Personalized service, owner's club",
  "revenue_streams": "Unit sales, commercial space rental",
  "key_resources": "Premium location, architectural design",
  "key_activities": "Real estate development, luxury marketing",
  "key_partners": "Prestigious construction companies",
  "cost_structure": "Land acquisition, construction, marketing",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Create/Update BMC
```http
POST /business_model_canvas
```

**Request Body:**
```json
{
  "project_id": "550e8400-e29b-41d4-a716-446655440001",
  "value_proposition": "Luxury apartments with panoramic views",
  "customer_segments": "High-income professionals and families",
  "channels": "Direct sales, premium real estate agents"
}
```

### Search and Filtering

#### Search Projects
```http
POST /rpc/search_projects
```

**Request Body:**
```json
{
  "search_term": "Torre",
  "status_filter": "active",
  "asset_class_filter": "residential"
}
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Torre Reforma Norte",
    "description": "Luxury residential development",
    "location": "Ciudad de Guatemala",
    "status": "active",
    "asset_class": "residential",
    "budget": 25000000,
    "mcda_score": 8.75,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Municipalities

#### List Municipalities
```http
GET /municipalities
```

**Query Parameters:**
- `country`: Filter by country
- `department`: Filter by department/state

**Response:**
```json
[
  {
    "id": "muni-uuid-1",
    "name": "Guatemala",
    "department": "Guatemala",
    "country": "Guatemala",
    "population": 1000000,
    "area_km2": 996.0,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

## Error Handling

### Error Response Format

```json
{
  "code": "PGRST301",
  "details": "Parsing failed",
  "hint": "Check your query syntax",
  "message": "JSON object requested, multiple (or no) rows returned"
}
```

### Common Error Codes

- `PGRST301`: Multiple rows returned when single expected
- `PGRST116`: No rows returned
- `PGRST204`: Invalid range
- `42501`: Insufficient privileges
- `23505`: Unique constraint violation

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `500`: Internal Server Error

## Rate Limiting

Supabase implements rate limiting based on your plan:

- **Free Tier**: 500 requests per second
- **Pro Tier**: 1000 requests per second
- **Enterprise**: Custom limits

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Examples

### JavaScript/TypeScript

#### Get All Projects
```javascript
import { supabase } from './lib/supabase';

async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }
  
  return data;
}
```

#### Create Project with MCDA Evaluation
```javascript
async function createProjectWithEvaluation(projectData, evaluations) {
  // Create project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();
    
  if (projectError) throw projectError;
  
  // Add MCDA evaluations
  for (const evaluation of evaluations) {
    await supabase.rpc('upsert_mcda_evaluation', {
      p_project_id: project.id,
      p_parameter_id: evaluation.parameter_id,
      p_value: evaluation.value,
      p_notes: evaluation.notes
    });
  }
  
  return project;
}
```

#### Real-time Subscriptions
```javascript
// Subscribe to project changes
const subscription = supabase
  .channel('projects')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'projects' },
    (payload) => {
      console.log('Project changed:', payload);
    }
  )
  .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

### Python

#### Using requests library
```python
import requests
import json

# Configuration
BASE_URL = "https://your-project.supabase.co/rest/v1"
API_KEY = "your_supabase_anon_key"

headers = {
    "apikey": API_KEY,
    "Content-Type": "application/json"
}

# Get projects
response = requests.get(f"{BASE_URL}/projects", headers=headers)
projects = response.json()

# Create project
project_data = {
    "name": "New Project",
    "status": "planning",
    "asset_class": "residential"
}

response = requests.post(
    f"{BASE_URL}/projects",
    headers=headers,
    data=json.dumps(project_data)
)

new_project = response.json()
```

### cURL

#### Get Projects
```bash
curl -X GET \
  "https://your-project.supabase.co/rest/v1/projects" \
  -H "apikey: your_supabase_anon_key" \
  -H "Content-Type: application/json"
```

#### Create Project
```bash
curl -X POST \
  "https://your-project.supabase.co/rest/v1/projects" \
  -H "apikey: your_supabase_anon_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Project",
    "status": "planning",
    "asset_class": "residential",
    "budget": 15000000
  }'
```

#### Calculate MCDA Score
```bash
curl -X POST \
  "https://your-project.supabase.co/rest/v1/rpc/calculate_mcda_score" \
  -H "apikey: your_supabase_anon_key" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

## SDKs and Libraries

### Official Supabase SDKs

- **JavaScript/TypeScript**: `@supabase/supabase-js`
- **Python**: `supabase-py`
- **Dart/Flutter**: `supabase_flutter`
- **Swift**: `supabase-swift`
- **Kotlin**: `supabase-kt`

### Community Libraries

- **PHP**: `supabase/supabase-php`
- **C#**: `supabase-community/supabase-csharp`
- **Go**: `supabase-community/supabase-go`
- **Rust**: `supabase-community/supabase-rs`

### Installation

#### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

#### Python
```bash
pip install supabase
```

### Configuration

#### JavaScript/TypeScript
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### Python
```python
from supabase import create_client, Client

url = "https://your-project.supabase.co"
key = "your-supabase-anon-key"

supabase: Client = create_client(url, key)
```

---

This API documentation provides comprehensive coverage of the GEOCUBO API. For additional support or questions, please refer to the [Supabase documentation](https://supabase.com/docs) or contact the development team.

