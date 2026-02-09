# Fullstack Developer - Herramientas

## Angular CLI

```bash
# Generar componente standalone
ng generate component features/<modulo>/pages/<nombre> --standalone --skip-tests

# Generar componente hijo
ng generate component features/<modulo>/components/<nombre> --standalone --skip-tests

# Generar servicio
ng generate service core/services/<nombre>

# Generar pipe
ng generate pipe shared/pipes/<nombre>

# Generar directiva
ng generate directive shared/directives/<nombre>

# Compilar el proyecto
ng build

# Iniciar servidor de desarrollo
ng serve

# Compilar para produccion
ng build --configuration=production
```

## Comandos de Verificacion

```bash
# Verificar que compila sin errores
ng build

# Verificar tipos TypeScript
npx tsc --noEmit

# Ejecutar lint
ng lint

# Iniciar servidor y verificar en navegador
ng serve --open
```

## Operaciones de Archivos

### Crear Feature Module Completo
```
Estructura a crear:
features/<nombre>/
  pages/
    <nombre>-main.component.ts
  components/
    <nombre>-card.component.ts
    <nombre>-form.component.ts
    <nombre>-filters.component.ts
  <nombre>.routes.ts
```

### Modificar Rutas Existentes
Archivos a editar:
- `src/app/app.routes.ts` → Agregar nueva ruta lazy-loaded
- `src/app/shared/components/sidebar/sidebar.component.ts` → Agregar enlace en navegacion

### Modificar Servicios
Archivos de servicios en `src/app/core/services/`:
```bash
# Ver servicios existentes
ls src/app/core/services/

# Revisar patron de un servicio existente
cat src/app/core/services/project.service.ts
cat src/app/core/services/task.service.ts
```

## Patrones de Codigo

### Template con Control Flow (Angular 20)
```html
<!-- Condicional -->
@if (condicion) {
  <div>contenido</div>
} @else {
  <div>alternativa</div>
}

<!-- Iteracion con tracking -->
@for (item of items(); track item.id) {
  <app-card [data]="item" />
} @empty {
  <app-empty-state message="Sin resultados" />
}

<!-- Switch -->
@switch (status()) {
  @case ('pending') { <span class="badge pending">Pendiente</span> }
  @case ('in-progress') { <span class="badge active">En Progreso</span> }
  @case ('completed') { <span class="badge done">Completado</span> }
}
```

### Inyeccion de Dependencias
```typescript
// CORRECTO: usar inject()
private readonly projectService = inject(ProjectService);
private readonly router = inject(Router);
private readonly route = inject(ActivatedRoute);

// INCORRECTO: no usar constructor DI
// constructor(private projectService: ProjectService) {}
```

### Comunicacion Padre-Hijo con Signals
```typescript
// Componente hijo
@Component({ ... })
export class HijoComponent {
  item = input.required<Tipo>();      // Input requerido
  variant = input<string>('default'); // Input opcional
  onSelect = output<Tipo>();          // Output event

  handleClick(): void {
    this.onSelect.emit(this.item());
  }
}

// Componente padre (template)
// <app-hijo [item]="item" (onSelect)="handleSelection($event)" />
```

## Busqueda y Navegacion del Codigo

```bash
# Buscar componentes por nombre
grep -r "selector: 'app-" src/app/ --include="*.ts"

# Buscar servicios registrados
grep -r "providedIn: 'root'" src/app/ --include="*.ts"

# Buscar imports de un modulo
grep -r "from '@features/" src/app/ --include="*.ts"
grep -r "from '@core/" src/app/ --include="*.ts"
grep -r "from '@shared/" src/app/ --include="*.ts"

# Buscar uso de un componente en templates
grep -r "<app-nombre" src/app/ --include="*.ts"
```

## Variables CSS Disponibles

```css
/* Usar siempre variables en vez de valores hardcoded */
color: var(--color-primary);
background: var(--color-surface);
padding: var(--spacing-md);
border-radius: var(--border-radius);
box-shadow: var(--shadow-sm);
font-size: var(--font-size-base);
font-family: var(--font-family);
```