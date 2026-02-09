# Database - Herramientas

## Comandos de Inspeccion de Modelos

```bash
# Ver todos los modelos existentes
ls src/app/core/models/

# Revisar un modelo especifico
cat src/app/core/models/project.model.ts
cat src/app/core/models/task.model.ts
cat src/app/core/models/team-member.model.ts
cat src/app/core/models/status.model.ts

# Buscar donde se usa un modelo
grep -r "Project" src/app/core/ --include="*.ts"
grep -r "import.*model" src/app/ --include="*.ts"
```

## Comandos de Inspeccion de Servicios de Datos

```bash
# Ver el servicio de base de datos
cat src/app/core/services/json-database.service.ts

# Ver el inicializador de datos
cat src/app/core/services/data-initializer.service.ts

# Ver los datos mock
cat src/app/core/services/mock-data.service.ts

# Ver datos semilla
cat src/assets/data/db.json
cat src/data/db.json
```

## Operaciones de Creacion de Modelos

### Crear nuevo archivo de modelo
Ubicacion: `src/app/core/models/<nombre>.model.ts`

Estructura obligatoria:
```typescript
// 1. Types literales
export type <Nombre>StatusType = 'valor1' | 'valor2';

// 2. Interface principal
export interface <Nombre> {
  id: string;
  // campos...
  createdAt: Date;
  updatedAt: Date;
}

// 3. DTO de creacion
export interface Create<Nombre>DTO {
  // campos requeridos sin id ni timestamps
}

// 4. DTO de actualizacion
export interface Update<Nombre>DTO {
  // campos opcionales (Partial)
}
```

## Operaciones sobre JsonDatabaseService

### Agregar nueva coleccion
Editar `src/app/core/services/json-database.service.ts`:

```typescript
// Agregar metodos CRUD para la nueva coleccion
get<Nombre>s(): <Nombre>[] {
  return this.getCollection<Nombre>('projectops_<nombres>');
}

save<Nombre>s(items: <Nombre>[]): void {
  this.setCollection('projectops_<nombres>', items);
}

create<Nombre>(dto: Create<Nombre>DTO): <Nombre> {
  const items = this.get<Nombre>s();
  const newItem: <Nombre> = {
    id: this.generateId('<prefijo>'),
    ...dto,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  items.push(newItem);
  this.save<Nombre>s(items);
  return newItem;
}

update<Nombre>(id: string, updates: Update<Nombre>DTO): <Nombre> | null {
  const items = this.get<Nombre>s();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updatedAt: new Date() };
  this.save<Nombre>s(items);
  return items[index];
}

delete<Nombre>(id: string): boolean {
  const items = this.get<Nombre>s();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  this.save<Nombre>s(filtered);
  return true;
}
```

## Operaciones sobre DataInitializerService

### Agregar inicializacion para nueva entidad
Editar `src/app/core/services/data-initializer.service.ts`:

```typescript
// En el metodo de inicializacion, agregar carga de nueva coleccion
if (!this.db.get<Nombre>s().length) {
  const seedData = dbJson.<nombres>;
  this.db.save<Nombre>s(seedData);
}
```

## Herramientas de Verificacion

```bash
# Verificar que los tipos compilan correctamente
ng build

# Buscar errores de tipo en todo el proyecto
npx tsc --noEmit

# Verificar integridad de imports
grep -r "from.*<nombre>.model" src/app/ --include="*.ts"
```

## Inspeccion de LocalStorage (via consola del navegador)

```javascript
// Ver colecciones almacenadas
Object.keys(localStorage).filter(k => k.startsWith('projectops_'));

// Ver contenido de una coleccion
JSON.parse(localStorage.getItem('projectops_projects'));
JSON.parse(localStorage.getItem('projectops_tasks'));
JSON.parse(localStorage.getItem('projectops_members'));

// Limpiar una coleccion para forzar reinicializacion
localStorage.removeItem('projectops_<nombre>');
```
