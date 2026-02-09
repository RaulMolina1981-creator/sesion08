# Tester - Herramientas

## Comandos de Ejecucion de Tests

```bash
# Ejecutar todos los tests
ng test

# Ejecutar tests sin watcher (una sola vez)
ng test --watch=false

# Ejecutar tests con reporte de cobertura
ng test --code-coverage

# Ejecutar tests de un archivo especifico
ng test --include='**/project.service.spec.ts'

# Ejecutar tests en modo headless (CI)
ng test --watch=false --browsers=ChromeHeadless
```

## Comandos de Inspeccion

```bash
# Ver archivos de test existentes
find src/app -name "*.spec.ts"

# Ver si un componente/servicio tiene test
ls src/app/core/services/project.service.spec.ts
ls src/app/features/projects/pages/projects-kanban.component.spec.ts

# Revisar un test existente como referencia
cat src/app/core/services/project.service.spec.ts

# Buscar patrones de test en el proyecto
grep -r "describe(" src/app/ --include="*.spec.ts"
grep -r "TestBed" src/app/ --include="*.spec.ts"
```

## Configuracion de TestBed

### Para Standalone Components
```typescript
await TestBed.configureTestingModule({
  imports: [ComponenteATestar],  // standalone components van en imports
  providers: [
    { provide: ServicioReal, useValue: mockServicio }
  ]
}).compileComponents();
```

### Para Servicios
```typescript
TestBed.configureTestingModule({
  providers: [
    ServicioATestar,
    { provide: DependenciaReal, useValue: mockDependencia }
  ]
});
service = TestBed.inject(ServicioATestar);
```

### Creacion de Spy Objects
```typescript
// Spy con metodos
const mockService = jasmine.createSpyObj('NombreService', [
  'loadItems', 'createItem', 'updateItem', 'deleteItem'
]);

// Spy con propiedades (signals)
const mockService = jasmine.createSpyObj('NombreService',
  ['loadItems', 'createItem'],
  {
    items$: signal<Tipo[]>([]),
    isLoading$: signal(false),
    error$: signal<string | null>(null),
    itemCount: computed(() => 0)
  }
);
```

## Interacciones DOM en Tests de Componentes

```typescript
// Obtener elemento del DOM
const element = fixture.nativeElement.querySelector('.clase-css');
const button = fixture.nativeElement.querySelector('button');

// Verificar texto
expect(element.textContent).toContain('texto esperado');

// Simular click
button.click();
fixture.detectChanges();

// Verificar que se llamo a un metodo
expect(mockService.deleteItem).toHaveBeenCalledWith('id-test');

// Verificar existencia de componente hijo
const spinner = fixture.nativeElement.querySelector('app-loading-spinner');
expect(spinner).toBeTruthy();

// Verificar lista de items renderizados
const cards = fixture.nativeElement.querySelectorAll('app-project-card');
expect(cards.length).toBe(3);
```

## Utilidades de Testing

### Helpers para Signals en Tests
```typescript
// Actualizar signal y forzar deteccion de cambios
mockService.items$.set([item1, item2]);
fixture.detectChanges();

// Verificar valor de signal
expect(component.datos$()).toEqual([item1, item2]);
expect(component.datosCount()).toBe(2);
```

### Datos Mock Reutilizables
```typescript
// Crear factory de mocks
function createMockProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'proj-test-' + Math.random().toString(36).substr(2, 9),
    name: 'Proyecto Test',
    description: 'Descripcion test',
    status: 'pending',
    startDate: new Date(),
    endDate: new Date(),
    budget: 10000,
    spent: 0,
    teamSize: 3,
    progress: 0,
    manager: 'Test Manager',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}
```

## Verificacion de Cobertura

```bash
# Generar reporte de cobertura
ng test --code-coverage --watch=false

# El reporte se genera en:
# coverage/index.html → Abrir en navegador para ver detalle

# Verificar cobertura minima (si esta configurada en karma.conf.js)
# thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 }
```

## Archivos de Configuracion de Testing

| Archivo | Proposito |
|---------|-----------|
| `karma.conf.js` | Configuracion del runner Karma |
| `tsconfig.spec.json` | Config TypeScript para tests |
| `src/test.ts` | Bootstrap de tests (si existe) |