# Optimization - Habilidades

## Optimizacion de Change Detection

### Migracion a OnPush
```typescript
@Component({
  selector: 'app-componente',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ComponenteComponent {
  // Con OnPush + Signals, el componente solo se re-renderiza
  // cuando un signal que usa en el template cambia
}
```

### Criterios para Aplicar OnPush
- Componentes que reciben datos via `input()` y no mutan estado interno
- Componentes que usan Signals para todo su estado
- Componentes de presentacion (cards, items, badges)
- **NO aplicar** a componentes que usan servicios que mutan estado con metodos imperativos

## Optimizacion de Signals

### Evitar Recomputaciones Innecesarias
```typescript
// MALO: computed que depende de todo el array
readonly totalBudget = computed(() =>
  this.projects$().reduce((sum, p) => sum + p.budget, 0)
);

// MEJOR: usar un signal separado para totales
readonly totalBudget$ = signal(0);

// Actualizar solo cuando cambia la lista
effect(() => {
  const projects = this.projects$();
  this.totalBudget$.set(projects.reduce((sum, p) => sum + p.budget, 0));
});
```

### Signals Selectivos
```typescript
// MALO: un signal con todo el estado
readonly state$ = signal({ projects: [], tasks: [], members: [] });

// MEJOR: signals separados por entidad
readonly projects$ = signal<Project[]>([]);
readonly tasks$ = signal<Task[]>([]);
readonly members$ = signal<TeamMember[]>([]);
```

### Evitar Effects Innecesarios
```typescript
// MALO: effect para sincronizar datos que podrian ser computed
effect(() => {
  this.filteredItems$.set(this.items$().filter(i => i.active));
});

// MEJOR: usar computed directamente
readonly filteredItems = computed(() =>
  this.items$().filter(i => i.active)
);
```

## Optimizacion de Lazy Loading

### Verificar que Todos los Features son Lazy
```typescript
// CORRECTO: lazy loading con loadChildren
{
  path: 'projects',
  loadChildren: () =>
    import('./features/projects/projects.routes')
      .then(m => m.PROJECTS_ROUTES)
}

// INCORRECTO: import directo (carga en bundle inicial)
import { PROJECTS_ROUTES } from './features/projects/projects.routes';
{ path: 'projects', children: PROJECTS_ROUTES }
```

### Preload Strategy
```typescript
// En app.config.ts, considerar preloading selectivo
provideRouter(
  routes,
  withPreloading(PreloadAllModules)  // o estrategia personalizada
)
```

## Optimizacion de Bundle Size

### Identificar Imports Innecesarios
- Verificar que no se importan modulos enteros cuando solo se usa una funcion
- Usar imports especificos: `import { signal } from '@angular/core'` (no `import * as`)
- Eliminar imports no usados en cada archivo

### Tree Shaking
- Verificar que los servicios `providedIn: 'root'` solo se instancian si se usan
- Eliminar codigo muerto: funciones, variables y clases no referenciadas
- Verificar que `angular.json` tiene `optimization: true` en produccion

## Optimizacion de Templates

### Track By en Iteraciones
```html
<!-- SIEMPRE usar track para evitar re-renderizado completo -->
@for (project of projects$(); track project.id) {
  <app-project-card [project]="project" />
}

<!-- NUNCA iterar sin track -->
@for (item of items$(); track $index) {  <!-- $index es aceptable pero menos optimo -->
  <div>{{ item.name }}</div>
}
```

### Evitar Computaciones en Templates
```html
<!-- MALO: funcion llamada en cada change detection -->
<div>{{ calculateTotal(projects) }}</div>

<!-- MEJOR: usar computed signal -->
<div>{{ total$() }}</div>
```

## Optimizacion de Imagenes y Assets

- Verificar que las imagenes usan formatos optimizados (WebP, AVIF)
- Usar `loading="lazy"` para imagenes below the fold
- Verificar que no hay assets grandes innecesarios en el bundle

## Refactorizacion de Rendimiento

### Migracion de Patrones Legacy
```typescript
// Observable → Signal
// BehaviorSubject<T> → signal<T>
// Observable pipe(map) → computed()
// subscribe + side effect → effect()

// Constructor DI → inject()
// NgModules → standalone components

// *ngIf → @if
// *ngFor → @for (con track)
// *ngSwitch → @switch
```

## Metricas y Medicion

### Analizar Bundle Size
```bash
# Build de produccion con stats
ng build --configuration=production --stats-json

# Analizar con source-map-explorer
npx source-map-explorer dist/**/*.js

# Ver tamanio de cada chunk
ls -la dist/browser/*.js
```

### Verificar Budgets en angular.json
```json
{
  "budgets": [
    { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" },
    { "type": "anyComponentStyle", "maximumWarning": "2kb", "maximumError": "4kb" }
  ]
}
```