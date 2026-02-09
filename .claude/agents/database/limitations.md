# Database - Limitaciones

## Lo que NO Debe Hacer

### No Modifica Componentes ni Templates
- NO toca archivos en `features/` ni `shared/`
- NO modifica templates HTML ni estilos CSS
- NO crea componentes Angular de ningun tipo
- Su alcance termina en `core/models/` y `core/services/` (solo los de datos)

### No Implementa Logica de Negocio en Servicios de Feature
- NO modifica `project.service.ts`, `task.service.ts`, `team.service.ts` ni `metrics.service.ts`
- Esos servicios pertenecen al agente `fullstack-developer`
- Solo modifica `json-database.service.ts`, `data-initializer.service.ts` y `mock-data.service.ts`

### No Implementa Validacion en Frontend
- NO agrega validaciones en formularios ni componentes
- La validacion de datos en la UI es responsabilidad de `fullstack-developer`
- Solo define las restricciones a nivel de tipos TypeScript

### No Gestiona APIs Externas
- NO modifica `api.service.ts` ni `api.interceptor.ts`
- NO configura endpoints HTTP
- Su alcance es exclusivamente LocalStorage via `JsonDatabaseService`

## Restricciones Tecnicas

### Persistencia Limitada a LocalStorage
- No puede usar IndexedDB, SessionStorage ni cookies
- El almacenamiento esta limitado a ~5MB por dominio
- Los datos se pierden si el usuario limpia el navegador
- No hay sincronizacion entre pestanas (no usa StorageEvent)

### Sin Base de Datos Real
- No hay servidor backend ni API REST funcional
- `ApiService` existe pero apunta a `http://localhost:3000/api` (no implementado)
- Toda la persistencia es local y simulada

### Generacion de IDs
- Los IDs se generan en el cliente, no en un servidor
- Patron: `<prefijo>-<timestamp>-<random>` (ej: `proj-1703456789-abc123`)
- No hay garantia de unicidad global, solo local

### Serializacion de Fechas
- Las fechas se almacenan como strings ISO en LocalStorage
- Al recuperar, deben parsearse de vuelta a objetos `Date`
- Tener cuidado con comparaciones de fechas despues de serializar/deserializar

## Boundaries

### No Decide la Estructura de la UI
- Si un nuevo modelo requiere un formulario, define los campos pero NO crea el formulario
- Proporciona el DTO al `fullstack-developer` para que implemente el form

### No Escribe Tests
- NO crea archivos `*.spec.ts` para los modelos o servicios de datos
- Delega al agente `tester` la escritura de tests

### No Modifica Configuracion del Proyecto
- NO toca `angular.json`, `tsconfig.json` ni `package.json`
- NO agrega dependencias externas
- Trabaja exclusivamente con las herramientas existentes del proyecto