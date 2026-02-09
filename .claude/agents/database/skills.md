# Database - Habilidades

## Diseno de Modelos de Datos

### Creacion de Interfaces
- Disenar interfaces TypeScript con tipado estricto para nuevas entidades
- Seguir la convencion del proyecto: `interface NombreEntidad` con campos tipados
- Incluir campos de auditoria: `id`, `createdAt`, `updatedAt`
- Definir campos opcionales con `?` cuando corresponda (ej: `avatar?`, `team?`)

### Creacion de DTOs
- Generar `CreateNombreDTO` con `Omit<Entidad, 'id' | 'createdAt' | 'updatedAt'>`
- Generar `UpdateNombreDTO` como `Partial<CreateNombreDTO>`
- Asegurar que los DTOs reflejen exactamente lo que el formulario enviara

### Definicion de Tipos Literales
- Crear union types para campos de estado: `type NuevoStatus = 'valor1' | 'valor2' | 'valor3'`
- Seguir la convencion `NombreTipoType` (ej: `StatusType`, `PriorityType`, `RoleType`)

## Patron de Modelo Estandar

```typescript
// nuevo-modelo.model.ts
export type NuevoStatusType = 'active' | 'inactive' | 'archived';

export interface NuevoModelo {
  id: string;
  name: string;
  description: string;
  status: NuevoStatusType;
  // ... campos especificos
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNuevoModeloDTO {
  name: string;
  description: string;
  status: NuevoStatusType;
  // ... campos requeridos para creacion
}

export interface UpdateNuevoModeloDTO {
  name?: string;
  description?: string;
  status?: NuevoStatusType;
  // ... campos opcionales para actualizacion
}
```

## Gestion de JsonDatabaseService

### Operaciones CRUD en LocalStorage
- Extender `JsonDatabaseService` con metodos para nuevas colecciones
- Implementar `getCollection<T>(key: string): T[]`
- Implementar `setCollection<T>(key: string, items: T[]): void`
- Generar IDs unicos con patron `prefix-timestamp-random`
- Mantener integridad referencial entre colecciones

### Estructura del LocalStorage
```
projectops_projects    → Project[]
projectops_tasks       → Task[]
projectops_members     → TeamMember[]
projectops_<nuevo>     → NuevaEntidad[]
```

## Datos Semilla y Mock Data

### Generacion de db.json
- Crear datos realistas para nuevas entidades
- Mantener coherencia con datos existentes (IDs referenciados deben existir)
- Incluir variedad de estados para cada entidad
- Minimo 5-10 registros por entidad nueva

### Mock Data Service
- Agregar metodos en `mock-data.service.ts` para datos de ejemplo de nuevas entidades
- Datos hardcoded para desarrollo y demos
- Cubrir todos los estados posibles de cada entidad

## Validacion de Datos

- Verificar que campos requeridos no sean `undefined` o `null`
- Validar que las referencias entre entidades existan (ej: `projectId` en Task debe corresponder a un Project real)
- Asegurar que los tipos literales solo contengan valores validos
- Verificar fechas coherentes (startDate antes de endDate)

## Migracion de Datos

- Cuando se modifica un modelo existente, manejar datos legacy en LocalStorage
- Proporcionar valores por defecto para campos nuevos
- No romper datos existentes al agregar campos opcionales