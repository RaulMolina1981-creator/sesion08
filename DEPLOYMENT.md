# Guía de Deployment - ProjectOps Dashboard

## 📋 Resumen

Esta guía explica cómo desplegar la aplicación Angular en Vercel o Netlify, y cómo resolver problemas locales.

---

## 🔴 PROBLEMA: Error en localhost

### Síntoma
La aplicación muestra: "No se puede acceder a este sitio web" con error `ERR_CONNECTION_REFUSED` en `http://localhost:4200`

### Causa Raíz
El **ApiService** intenta conectarse a `http://localhost:3000/api` pero **no hay backend ejecutándose**.

### Soluciones

#### Opción 1: Usar Mock Data (Recomendado para desarrollo)

1. **Modificar el ProjectService** para usar mock data:

```typescript
import { MockDataService } from './mock-data.service';

constructor(
  private apiService: ApiService,
  private mockDataService: MockDataService
) {}

loadProjects() {
  // En desarrollo, usar mock data
  if (environment.useMockData) {
    this.projectsSource.set(this.mockDataService.getMockProjects());
    this.loadingSource.set(false);
    return;
  }
  // En producción, usar API real
  this.loadingSource.set(true);
  // ... rest of the code
}
```

2. **Crear archivo `environment.ts`** en `src/`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useMockData: true // Cambiar a false cuando tengas backend
};
```

3. **Ejecutar el servidor:**

```bash
pnpm start
```

#### Opción 2: Implementar Backend Node.js (Express)

Crear un servidor simple en la carpeta `server/`:

```bash
npm init -y
npm install express cors dotenv
```

Crear `server/index.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock endpoints
app.get('/api/projects', (req, res) => {
  res.json([/* projects data */]);
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
```

---

## 🚀 Deployment en Vercel

### Pasos:

1. **Conectar repositorio:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa el repositorio Git
   - Vercel detectará automáticamente que es Angular

2. **Configuración automática:**
   - Build Command: `pnpm build`
   - Output Directory: `dist/projectops-dashboard`
   - Framework: Angular

3. **Variables de entorno:**
   - En Project Settings → Environment Variables
   - Añade: `API_BASE_URL=https://api.example.com`

4. **Deploy:**
   ```bash
   npm install -g vercel
   vercel
   ```

### Archivo: `vercel.json` ✅ (Ya creado)
- Configura rutas SPA
- Cache headers
- Security headers
- Proxy a API externa

---

## 🚀 Deployment en Netlify

### Pasos:

1. **Conectar repositorio:**
   - Ve a [netlify.com](https://netlify.com)
   - Selecciona "New site from Git"
   - Elige el repositorio

2. **Build Configuration (Automática):**
   - Build command: `pnpm build`
   - Publish directory: `dist/projectops-dashboard`
   - Node version: 20 (configurado en `netlify.toml`)

3. **Deploy:**
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

### Archivo: `netlify.toml` ✅ (Ya creado)
- Configuración SPA con redirección a `/index.html`
- Cache control inteligente por tipo de archivo
- Headers de seguridad
- Soporte para funciones serverless

---

## 📦 Archivos Creados

### 1. **ProjectOpsService** ✅
- Ubicación: `src/app/core/services/project-ops.service.ts`
- Características:
  - Orquesta Proyectos, Tareas y Equipo
  - **Signals** para reactividad
  - **Computed signals** para métricas:
    - `totalProjectProgress`
    - `taskCompletionRate`
    - `teamUtilization`
    - `dashboardSummary`
  - Setters para actualizar datos
  - Sincronización automática con servicios individuales

### 2. **MockDataService** ✅
- Ubicación: `src/app/core/services/mock-data.service.ts`
- Proporciona datos de ejemplo para:
  - 5 proyectos en diferentes estados
  - 6 tareas con prioridades variadas
  - 7 miembros de equipo

### 3. **vercel.json** ✅
- Configuración para desplegar en Vercel
- Rutas SPA automáticas
- Cache y headers de seguridad

### 4. **netlify.toml** ✅
- Configuración para desplegar en Netlify
- Redirecciones automáticas de SPA
- Caché inteligente por tipo de archivo

### 5. **.env.example** ✅
- Template de variables de entorno

---

## 🔧 Pasos para que funcione en localhost

### Paso 1: Usar Mock Data

Editar `src/app/core/services/project.service.ts`:

```typescript
import { MockDataService } from './mock-data.service';

// Inyectar el servicio
constructor(
  private apiService: ApiService,
  private mockDataService: MockDataService
) {}

// Reemplazar loadProjects()
loadProjects() {
  // Usar mock data en desarrollo
  const mockData = this.mockDataService.getMockProjects();
  this.projectsSource.set(mockData);
  this.loadingSource.set(false);
}
```

### Paso 2: Ejecutar en local

```bash
# Terminal 1: Servidor de desarrollo Angular
pnpm start

# Terminal 2 (opcional): Backend Node.js si lo tienes
node server/index.js
```

### Paso 3: Abrir navegador
```
http://localhost:4200
```

---

## 📊 Métricas Disponibles (ProjectOpsService)

```typescript
// Computed signals automáticos:
- projectCount: Número total de proyectos
- taskCount: Número total de tareas
- teamMemberCount: Miembros del equipo
- activeProjects: Proyectos en progreso
- completedProjects: Proyectos terminados
- pendingProjects: Proyectos pendientes
- incompleteTasks: Tareas sin completar
- completedTasks: Tareas completadas
- taskCompletionRate: Porcentaje de tareas completadas
- teamUtilization: Utilización del equipo (%)
- projectsOverdue: Proyectos vencidos
- highPriorityTasks: Tareas de alta prioridad
- dashboardSummary: Resumen consolidado de todas las métricas
```

---

## ✅ Checklist de Deployment

- [ ] Mock data funciona en localhost
- [ ] `pnpm build` compila sin errores
- [ ] `pnpm start` se ejecuta correctamente
- [ ] Todos los servicios inyectados correctamente
- [ ] Variables de entorno configuradas
- [ ] Repositorio conectado a Vercel/Netlify
- [ ] Build automático habilitado
- [ ] API_BASE_URL configurada en producción

---

## 🆘 Troubleshooting

### Error: "Can't resolve module"
```bash
pnpm install
rm -rf node_modules
pnpm install --force
```

### Error: "CORS"
Asegúrate de que tu API tiene headers CORS correctos:
```javascript
app.use(cors({
  origin: 'https://tu-dominio.vercel.app',
  credentials: true
}));
```

### Build timeout
Aumentar timeout en `vercel.json`:
```json
{
  "buildCommand": "pnpm build",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node",
      "config": {
        "maxDuration": 120
      }
    }
  ]
}
```

---

## 📚 Enlaces Útiles

- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Vercel Angular Docs](https://vercel.com/frameworks/angular)
- [Netlify Angular Docs](https://docs.netlify.com/frameworks/angular/)
- [Environment Variables](https://angular.io/guide/build#using-environment-specific-variables)

