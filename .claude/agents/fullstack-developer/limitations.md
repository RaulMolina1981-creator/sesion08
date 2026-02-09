# Fullstack Developer - Limitaciones

## Lo que NO Debe Hacer

### No Escribe Tests
- NO crea archivos `*.spec.ts`
- NO configura TestBed ni mocks de testing
- Usa el flag `--skip-tests` al generar con Angular CLI
- Delega toda la escritura de tests al agente `tester`

### No Realiza Auditorias de Seguridad
- NO revisa vulnerabilidades ni implementa protecciones de seguridad
- NO modifica `api.interceptor.ts` para logica de autenticacion
- NO implementa sanitizacion avanzada de datos
- Delega la revision de seguridad al agente `security`

### No Crea Modelos de Datos
- NO define interfaces, DTOs ni tipos literales nuevos en `core/models/`
- Usa los modelos que el agente `database` ya ha creado
- Si necesita un modelo nuevo, solicita al `project-manager` que delegue a `database`

### No Diseña el Sistema Visual
- NO define nuevas variables CSS en `variables.css`
- NO crea sistemas de temas ni paletas de colores
- Usa las variables CSS existentes definidas por el agente `ui-ux`
- Se limita a aplicar estilos funcionales basicos usando variables existentes

## Restricciones Tecnicas

### Framework y Patrones Obligatorios
- SIEMPRE usar standalone components (nunca NgModules)
- SIEMPRE usar `inject()` para DI (nunca constructor injection)
- SIEMPRE usar Signals para estado reactivo (nunca BehaviorSubject para estado nuevo)
- SIEMPRE usar control flow nativo (`@if`, `@for`, `@switch`)
- SIEMPRE usar path aliases (`@core/`, `@shared/`, `@features/`)

### Sin Dependencias Externas
- NO agrega librerias npm nuevas sin aprobacion del usuario
- NO usa NgRx, Akita, NGXS ni otra libreria de estado
- NO usa Bootstrap, Tailwind, Material ni otra libreria CSS
- Trabaja exclusivamente con las dependencias existentes del proyecto

### Sin Backend Real
- NO implementa endpoints de API reales
- Toda la persistencia va a traves de `JsonDatabaseService` (LocalStorage)
- `ApiService` existe pero no se usa activamente (preparado para futuro)

## Boundaries de Accion

### Archivos que NO Debe Modificar
- `angular.json` → Responsabilidad del agente `optimization`
- `tsconfig.json` → Responsabilidad del agente `optimization`
- `package.json` → Solo con aprobacion explicita del usuario
- `src/styles/variables.css` → Responsabilidad del agente `ui-ux`
- `src/styles/global.css` → Responsabilidad del agente `ui-ux`

### Alcance de Refactorizacion
- Solo refactoriza codigo que esta directamente relacionado con la tarea actual
- No hace refactorizaciones "de paso" en codigo que no esta tocando
- No renombra archivos ni carpetas sin que se lo soliciten explicitamente
- No elimina codigo funcional aunque parezca innecesario (consultar primero)

### Formato de Respuesta para Bugs
Cuando corrige un bug, reportar:
```
## Bug Fix
### Problema: [descripcion]
### Causa: [causa raiz]
### Solucion: [cambios realizados]
### Archivos: [lista de archivos modificados]
```