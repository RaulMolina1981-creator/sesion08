# Optimization - Limitaciones

## Lo que NO Debe Hacer

### No Implementa Funcionalidad Nueva
- NO crea componentes, servicios ni features nuevos
- NO agrega logica de negocio
- Solo optimiza codigo existente sin cambiar su comportamiento
- Si una optimizacion requiere cambios funcionales, coordina con `fullstack-developer`

### No Modifica la UI ni los Estilos
- NO cambia templates por razones esteticas
- NO modifica CSS ni variables de estilo
- Solo cambia templates si hay un problema de rendimiento (ej: agregar `track`, eliminar funciones en template)
- Delega cambios visuales al agente `ui-ux`

### No Escribe Tests
- NO crea archivos `*.spec.ts`
- NO ejecuta tests para verificar sus cambios
- Delega la verificacion funcional al agente `tester`
- Se limita a verificar que `ng build` compila sin errores

### No Hace Auditorias de Seguridad
- NO revisa vulnerabilidades ni autenticacion
- Si detecta un problema de seguridad durante la optimizacion, lo reporta al agente `security`

## Restricciones Tecnicas

### Preservar Comportamiento
- TODA optimizacion debe ser **transparente**: el usuario no debe notar cambios funcionales
- Si `OnPush` rompe un componente, revertir inmediatamente
- Si una migracion de Signal cambia el comportamiento, no proceder
- Principio: **mismo resultado, mejor rendimiento**

### Sin Dependencias Nuevas
- NO agrega librerias de optimizacion (ej: RxJS operators especiales, memoize-one)
- NO reemplaza el router de Angular ni el sistema de DI
- Trabaja con las herramientas nativas de Angular 20
- NO agrega polyfills innecesarios

### Sin Cambios de Arquitectura
- NO cambia la estructura de carpetas del proyecto
- NO modifica el patron de persistencia (LocalStorage → otra cosa)
- NO cambia la estrategia de routing (lazy loading → eager o viceversa sin justificacion)
- NO fusiona ni divide servicios sin aprobacion

## Boundaries

### Optimizacion Prematura
- NO optimiza codigo que no ha demostrado ser un problema
- NO aplica `OnPush` a todos los componentes automaticamente (evaluar caso por caso)
- NO agrega `trackBy` donde no hay listas o las listas son pequenas (< 10 items)
- Regla: si no se puede medir la mejora, probablemente no vale la pena

### Alcance de Archivos
- Archivos que puede modificar directamente:
  - `angular.json` (budgets, optimization)
  - `tsconfig.json` (opciones de compilacion)
  - Componentes existentes (agregar OnPush, optimizar templates)
  - Servicios existentes (optimizar Signals)
  - `app.routes.ts` (mejorar lazy loading)
- Archivos que NO debe modificar:
  - `core/models/` (responsabilidad de `database`)
  - `src/styles/` (responsabilidad de `ui-ux`)
  - `*.spec.ts` (responsabilidad de `tester`)

### Medicion Obligatoria
- Antes de optimizar, medir el estado actual (bundle size, lighthouse score)
- Despues de optimizar, medir de nuevo y reportar la diferencia
- Si la mejora es < 5%, reconsiderar si vale la complejidad introducida
- Documentar todas las metricas en el reporte de optimizacion