# PROMPT: Reestructuración del Sistema de Agentes Claude

## OBJETIVO

Reestructura el sistema de agentes en `.claude/agents/` del proyecto **ProjectOps Dashboard** (Angular 20). Actualmente tenemos 7 archivos `.md` sueltos. Necesito migrar a una estructura de **carpetas por agente**, donde cada agente tiene 4 archivos: `context.md`, `skills.md`, `tools.md` y `limitations.md`. Además, necesito un `project.json` orquestador y un meta-agente `project-manager`.

---

## ESTRUCTURA ACTUAL (ELIMINAR)

```
.claude/agents/
  angular-component-generator.md
  angular-service-generator.md
  bug-fixer.md
  code-reviewer.md
  feature-implementer.md
  refactor-agent.md
  test-writer.md
```

## ESTRUCTURA OBJETIVO (CREAR)

```
.claude/agents/
  project.json                    ← Orquestador: define todos los agentes y sus relaciones
  project-manager/                ← Meta-agente que coordina a los demás
    context.md
    skills.md
    tools.md
    limitations.md
  database/                       ← Especialista en datos, modelos y JsonDatabaseService
    context.md
    skills.md
    tools.md
    limitations.md
  fullstack-developer/            ← Genera componentes, servicios, rutas (Angular 20)
    context.md
    skills.md
    tools.md
    limitations.md
  tester/                         ← Tests unitarios y E2E con Jasmine/Karma
    context.md
    skills.md
    tools.md
    limitations.md
  security/                       ← Auditoría de seguridad, interceptors, auth
    context.md
    skills.md
    tools.md
    limitations.md
  optimization/                   ← Performance, bundle size, Signals, OnPush
    context.md
    skills.md
    tools.md
    limitations.md
  ui-ux/                          ← Estilos, responsividad, componentes UI, temas
    context.md
    skills.md
    tools.md
    limitations.md
  documentation/                  ← Documentación técnica, README, comentarios
    context.md
    skills.md
    tools.md
    limitations.md
```

---

## FORMATO DE CADA ARCHIVO

### context.md
Define el ROL del agente, su personalidad, en qué parte del proyecto opera y cuándo debe ser invocado.

### skills.md
Lista las HABILIDADES específicas del agente: qué sabe hacer, qué patrones conoce, qué puede generar.

### tools.md
Define las HERRAMIENTAS y comandos que el agente puede usar: comandos de Angular CLI, operaciones CRUD, queries de datos, etc.

### limitations.md
Establece las LIMITACIONES: qué NO debe hacer el agente, restricciones técnicas, boundaries de su alcance.

---

## CONTEXTO COMPLETO DEL PROYECTO

### Stack Tecnológico
- **Angular 20** con standalone components (sin NgModules)
- **TypeScript 5.9** con strict mode
- **Signals** para estado reactivo (`signal()`, `computed()`, `effect()`)
- **CSS puro** con variables CSS (sin SCSS en componentes)
- **Jasmine + Karma** para testing
- **LocalStorage** via JsonDatabaseService (sin backend real)
- **Lazy loading** por feature module

### Path Aliases (tsconfig.json)
```
@app/*       → src/app/*
@core/*      → src/app/core/*
@shared/*    → src/app/shared/*
@features/*  → src/app/features/*
```

### Arquitectura de Carpetas
```
src/app/
  core/
    models/
      project.model.ts      → Project, CreateProjectDTO, UpdateProjectDTO
      task.model.ts          → Task, CreateTaskDTO, UpdateTaskDTO, PriorityType
      team-member.model.ts   → TeamMember, CreateTeamMemberDTO, UpdateTeamMemberDTO, RoleType
      status.model.ts        → StatusType, Status
    services/
      api.service.ts              → HTTP client (base: http://localhost:3000/api)
      json-database.service.ts    → LocalStorage CRUD persistence
      data-initializer.service.ts → APP_INITIALIZER, carga db.json
      mock-data.service.ts        → Datos de ejemplo hardcoded
      state.service.ts            → Estado global (tema, sidebar, notificaciones)
      modal.service.ts            → Gestión de modales
      project.service.ts          → CRUD Proyectos con Signals
      task.service.ts             → CRUD Tareas con Signals
      team.service.ts             → CRUD Equipo con Signals
      metrics.service.ts          → Métricas computadas con Signals
      project-ops.service.ts      → Orquestación general (dashboardSummary)
    interceptors/
      api.interceptor.ts          → Bearer token auth
  features/
    projects/
      pages/projects-kanban.component.ts    → Kanban board con drag&drop
      components/project-card.component.ts
      components/project-modal.component.ts
      components/project-filters.component.ts
      components/create-project-form.component.ts
      projects.routes.ts
    tasks/
      pages/tasks-list.component.ts         → Lista con filtros y ordenamiento
      components/task-item.component.ts
      components/task-form.component.ts
      components/task-filters.component.ts
      components/create-task-form.component.ts
      tasks.routes.ts
    team/
      pages/team-overview.component.ts      → Grid de miembros con avatares
      components/team-grid.component.ts
      components/team-member-card.component.ts
      components/create-team-member-form.component.ts
      team.routes.ts
    metrics/
      pages/metrics-dashboard.component.ts  → Dashboard con stats y charts
      components/metric-card.component.ts
      components/summary-stats.component.ts
      components/chart-widget.component.ts
      metrics.routes.ts
  shared/
    components/
      main-layout/main-layout.component.ts  → Layout principal
      header/header.component.ts
      sidebar/sidebar.component.ts
      modal-container.component.ts
    ui/
      button/button.component.ts
      button/primary-button.component.ts
      loading-spinner/loading-spinner.component.ts
      empty-state/empty-state.component.ts
      error-message/error-message.component.ts
    directives/
    pipes/
```

### Rutas (app.routes.ts)
```
'' → redirect '/dashboard/projects'
'dashboard' (MainLayoutComponent)
  ├─ 'projects' → lazy PROJECTS_ROUTES
  ├─ 'tasks'    → lazy TASKS_ROUTES
  ├─ 'team'     → lazy TEAM_ROUTES
  └─ 'metrics'  → lazy METRICS_ROUTES
'**' → redirect '/dashboard/projects'
```

### Modelos de Datos

**StatusType:** `'pending' | 'in-progress' | 'completed' | 'blocked' | 'cancelled'`
**PriorityType:** `'low' | 'medium' | 'high' | 'critical'`
**RoleType:** `'developer' | 'designer' | 'manager' | 'qa' | 'devops'`

**Project:** id, name, description, status, startDate, endDate, budget, spent, teamSize, progress, manager, team?, createdAt, updatedAt

**Task:** id, title, description, projectId, assignedTo, status, priority, dueDate, estimatedHours, spentHours, createdAt, updatedAt

**TeamMember:** id, name, email, role, avatar?, department, joinDate, active, projects[], skills[], createdAt

### Patrón de Servicio CRUD con Signals
```typescript
@Injectable({ providedIn: 'root' })
export class XxxService {
  private readonly db = inject(JsonDatabaseService);
  readonly items$ = signal<Tipo[]>([]);
  readonly isLoading$ = signal(false);
  readonly itemCount = computed(() => this.items$().length);

  loadItems(): void { ... }
  createItem(dto: CreateDTO): void { ... }
  updateItem(id: string, updates: UpdateDTO): void { ... }
  deleteItem(id: string): void { ... }
}
```

### Patrón de Componente Standalone
```typescript
@Component({
  selector: 'app-xxx',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styles: [`...`]
})
export class XxxComponent {
  private readonly service = inject(XxxService);
  readonly datos = signal<Tipo[]>([]);
  readonly datosActivos = computed(() => this.datos().filter(...));
}
```

### Variables CSS Disponibles
```
--color-primary, --color-secondary, --color-success, --color-warning, --color-danger
--sidebar-width, --header-height
--border-radius, --shadow-sm, --shadow-md, --shadow-lg
--font-family, --font-size-sm, --font-size-base, --font-size-lg
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl
```

### Scripts de package.json
```
ng serve    → start
ng build    → build
ng test     → test
ng lint     → lint
```

---

## INSTRUCCIONES

1. **Elimina** todos los archivos `.md` sueltos actuales en `.claude/agents/`
2. **Crea** la estructura de carpetas completa con los 8 agentes
3. **Crea** el `project.json` que define la orquestación
4. **Cada archivo** debe ser específico al proyecto ProjectOps Dashboard, NO genérico
5. **Usa español** en el contenido de los archivos
6. **Sé exhaustivo** en skills y tools — incluye comandos concretos, patrones de código reales, referencias a archivos específicos del proyecto
7. El `project-manager` debe saber coordinar a los demás agentes y conocer cuándo delegar a cada uno
