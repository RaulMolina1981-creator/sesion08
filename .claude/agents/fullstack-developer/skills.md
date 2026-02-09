# Fullstack Developer - Habilidades

## Creacion de Componentes Standalone

### Patron de Componente Estandar
```typescript
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nombre-componente',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading$()) {
      <app-loading-spinner />
    } @else if (error$()) {
      <app-error-message [message]="error$()" />
    } @else if (items$().length === 0) {
      <app-empty-state message="No hay elementos" />
    } @else {
      @for (item of items$(); track item.id) {
        <app-item-card [item]="item" />
      }
    }
  `,
  styles: [`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }
  `]
})
export class NombreComponenteComponent implements OnInit {
  private readonly service = inject(NombreService);

  readonly items$ = this.service.items$;
  readonly isLoading$ = this.service.isLoading$;
  readonly error$ = this.service.error$;

  readonly itemsActivos = computed(() =>
    this.items$().filter(item => item.active)
  );

  ngOnInit(): void {
    this.service.loadItems();
  }
}
```

### Tipos de Componentes

#### Pagina (Page Component)
- Ubicacion: `features/<modulo>/pages/`
- Responsabilidad: orquesta la pagina completa, inyecta servicios
- Ejemplo: `projects-kanban.component.ts`, `tasks-list.component.ts`

#### Componente de Presentacion (Card/Item)
- Ubicacion: `features/<modulo>/components/`
- Responsabilidad: muestra datos de una entidad, emite eventos
- Usa `input()` para recibir datos y `output()` para emitir eventos
- Ejemplo: `project-card.component.ts`, `task-item.component.ts`

#### Formulario (Form Component)
- Ubicacion: `features/<modulo>/components/`
- Responsabilidad: captura datos del usuario para crear/editar
- Usa `FormsModule` o `ReactiveFormsModule`
- Ejemplo: `create-project-form.component.ts`, `task-form.component.ts`

#### Filtros (Filter Component)
- Ubicacion: `features/<modulo>/components/`
- Responsabilidad: filtra listas por estado, prioridad, etc.
- Emite eventos con criterios de filtro al componente padre
- Ejemplo: `project-filters.component.ts`, `task-filters.component.ts`

## Creacion de Servicios con Signals

### Patron de Servicio CRUD
```typescript
@Injectable({ providedIn: 'root' })
export class NombreService {
  private readonly db = inject(JsonDatabaseService);

  readonly items$ = signal<Tipo[]>([]);
  readonly isLoading$ = signal(false);
  readonly error$ = signal<string | null>(null);
  readonly selectedItem$ = signal<Tipo | null>(null);

  readonly itemCount = computed(() => this.items$().length);
  readonly activeItems = computed(() =>
    this.items$().filter(item => item.status !== 'cancelled')
  );

  loadItems(): void {
    this.isLoading$.set(true);
    this.error$.set(null);
    try {
      const items = this.db.getItems('coleccion');
      this.items$.set(items);
    } catch (e) {
      this.error$.set('Error al cargar datos');
    } finally {
      this.isLoading$.set(false);
    }
  }

  createItem(dto: CreateDTO): void {
    const newItem = this.db.createItem('coleccion', dto);
    this.items$.update(items => [...items, newItem]);
  }

  updateItem(id: string, updates: UpdateDTO): void {
    const updated = this.db.updateItem('coleccion', id, updates);
    if (updated) {
      this.items$.update(items =>
        items.map(item => item.id === id ? updated : item)
      );
    }
  }

  deleteItem(id: string): void {
    this.db.deleteItem('coleccion', id);
    this.items$.update(items => items.filter(item => item.id !== id));
  }
}
```

## Gestion de Rutas

### Crear rutas de feature module
```typescript
// features/<modulo>/<modulo>.routes.ts
import { Routes } from '@angular/router';

export const MODULO_ROUTES: Routes = [
  {
    path: '',
    component: PaginaPrincipalComponent
  },
  {
    path: ':id',
    component: DetalleComponent
  }
];
```

### Registrar ruta lazy-loaded en app.routes.ts
```typescript
{
  path: 'nuevo-modulo',
  loadChildren: () =>
    import('./features/nuevo-modulo/nuevo-modulo.routes')
      .then(m => m.NUEVO_MODULO_ROUTES)
}
```

## Diagnostico y Correccion de Bugs

### Errores Comunes en Signals
- Acceder a `signal.value` en vez de `signal()` (llamar como funcion)
- Mutar arrays sin `.update()` o `.set()` (ej: push directo)
- Dependencias circulares en `computed()` o `effect()`

### Errores Comunes en Componentes
- Imports faltantes en el array `imports` del standalone component
- Selectores duplicados entre componentes
- Binding incorrecto: `[property]` vs `(event)` vs `[(ngModel)]`

### Errores Comunes en Servicios
- Servicio sin `providedIn: 'root'`
- Inyeccion circular entre servicios
- LocalStorage vacio sin datos inicializados

## Componentes UI Reutilizables Disponibles

| Componente | Ubicacion | Uso |
|------------|-----------|-----|
| `LoadingSpinnerComponent` | `shared/ui/loading-spinner/` | Estado de carga |
| `EmptyStateComponent` | `shared/ui/empty-state/` | Listas vacias |
| `ErrorMessageComponent` | `shared/ui/error-message/` | Mensajes de error |
| `ButtonComponent` | `shared/ui/button/` | Botones genericos |
| `PrimaryButtonComponent` | `shared/ui/button/` | Botones de accion principal |