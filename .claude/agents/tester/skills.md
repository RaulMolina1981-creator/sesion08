# Tester - Habilidades

## Testing de Componentes Standalone

### Configuracion de TestBed para Standalone Components
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NombreComponent } from './nombre.component';
import { NombreService } from '@core/services/nombre.service';

describe('NombreComponent', () => {
  let component: NombreComponent;
  let fixture: ComponentFixture<NombreComponent>;
  let mockService: jasmine.SpyObj<NombreService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('NombreService', [
      'loadItems', 'createItem', 'updateItem', 'deleteItem'
    ], {
      items$: signal<Tipo[]>([]),
      isLoading$: signal(false),
      error$: signal<string | null>(null)
    });

    await TestBed.configureTestingModule({
      imports: [NombreComponent],
      providers: [
        { provide: NombreService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NombreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar datos al inicializar', () => {
    expect(mockService.loadItems).toHaveBeenCalled();
  });

  it('deberia mostrar spinner cuando esta cargando', () => {
    mockService.isLoading$.set(true);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('app-loading-spinner');
    expect(spinner).toBeTruthy();
  });

  it('deberia mostrar empty state sin datos', () => {
    mockService.items$.set([]);
    mockService.isLoading$.set(false);
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('app-empty-state');
    expect(empty).toBeTruthy();
  });
});
```

## Testing de Servicios con Signals

### Configuracion de TestBed para Servicios
```typescript
describe('NombreService', () => {
  let service: NombreService;
  let mockDb: jasmine.SpyObj<JsonDatabaseService>;

  beforeEach(() => {
    mockDb = jasmine.createSpyObj('JsonDatabaseService', [
      'getItems', 'createItem', 'updateItem', 'deleteItem'
    ]);

    TestBed.configureTestingModule({
      providers: [
        NombreService,
        { provide: JsonDatabaseService, useValue: mockDb }
      ]
    });

    service = TestBed.inject(NombreService);
  });

  it('deberia inicializar con lista vacia', () => {
    expect(service.items$()).toEqual([]);
    expect(service.isLoading$()).toBeFalse();
  });

  it('deberia cargar items correctamente', () => {
    const mockItems = [mockItem1, mockItem2];
    mockDb.getItems.and.returnValue(mockItems);

    service.loadItems();

    expect(service.items$()).toEqual(mockItems);
    expect(service.isLoading$()).toBeFalse();
  });

  it('deberia crear un item nuevo', () => {
    const dto: CreateDTO = { name: 'Nuevo', description: 'Test' };
    const creado = { id: 'test-1', ...dto, createdAt: new Date(), updatedAt: new Date() };
    mockDb.createItem.and.returnValue(creado);

    service.createItem(dto);

    expect(service.items$()).toContain(creado);
  });

  it('deberia actualizar un item existente', () => {
    const original = { id: 'test-1', name: 'Original' };
    service.items$.set([original as any]);
    const updated = { ...original, name: 'Modificado' };
    mockDb.updateItem.and.returnValue(updated);

    service.updateItem('test-1', { name: 'Modificado' });

    expect(service.items$()[0].name).toBe('Modificado');
  });

  it('deberia eliminar un item', () => {
    service.items$.set([{ id: 'test-1' } as any, { id: 'test-2' } as any]);

    service.deleteItem('test-1');

    expect(service.items$().length).toBe(1);
    expect(service.items$()[0].id).toBe('test-2');
  });

  it('deberia calcular computed signals correctamente', () => {
    service.items$.set([mockItem1, mockItem2, mockItem3]);
    expect(service.itemCount()).toBe(3);
  });
});
```

## Testing de Pipes

```typescript
describe('StatusBadgePipe', () => {
  let pipe: StatusBadgePipe;

  beforeEach(() => {
    pipe = new StatusBadgePipe();
  });

  it('deberia transformar "pending" a "Pendiente"', () => {
    expect(pipe.transform('pending')).toBe('Pendiente');
  });

  it('deberia transformar "in-progress" a "En Progreso"', () => {
    expect(pipe.transform('in-progress')).toBe('En Progreso');
  });
});
```

## Generacion de Datos Mock Realistas

### Mock de Project
```typescript
const mockProject: Project = {
  id: 'proj-test-001',
  name: 'Proyecto de Prueba',
  description: 'Descripcion del proyecto de prueba',
  status: 'in-progress' as StatusType,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  budget: 50000,
  spent: 25000,
  teamSize: 5,
  progress: 50,
  manager: 'Juan Perez',
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### Mock de Task
```typescript
const mockTask: Task = {
  id: 'task-test-001',
  title: 'Tarea de Prueba',
  description: 'Descripcion de la tarea de prueba',
  projectId: 'proj-test-001',
  assignedTo: 'member-test-001',
  status: 'pending' as StatusType,
  priority: 'high' as PriorityType,
  dueDate: new Date('2024-06-30'),
  estimatedHours: 8,
  spentHours: 4,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### Mock de TeamMember
```typescript
const mockMember: TeamMember = {
  id: 'member-test-001',
  name: 'Maria Lopez',
  email: 'maria@example.com',
  role: 'developer' as RoleType,
  department: 'Ingenieria',
  joinDate: new Date('2023-01-15'),
  active: true,
  projects: ['proj-test-001'],
  skills: ['Angular', 'TypeScript', 'CSS'],
  createdAt: new Date()
};
```

## Escenarios de Cobertura Obligatoria

1. **Creacion**: El componente/servicio se crea correctamente
2. **Estado inicial**: Signals tienen los valores por defecto correctos
3. **CRUD completo**: Create, Read, Update, Delete funcionan
4. **Loading/Error**: Los estados de carga y error se manejan
5. **Computed signals**: Los valores derivados se calculan bien
6. **Edge cases**: Listas vacias, datos nulos, IDs inexistentes
7. **Interacciones**: Clicks, inputs, selecciones en componentes