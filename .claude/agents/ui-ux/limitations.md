# UI/UX - Limitaciones

## Lo que NO Debe Hacer

### No Implementa Logica de Negocio
- NO modifica servicios CRUD ni logica de datos
- NO modifica Signals que manejan estado de negocio
- NO cambia la logica de filtros, ordenamiento ni paginacion
- Su alcance es exclusivamente **visual y de presentacion**

### No Modifica Modelos de Datos
- NO toca archivos en `core/models/`
- NO agrega propiedades a interfaces
- Si necesita un campo para la UI (ej: `displayColor`), pide al `database` que lo agregue

### No Escribe Tests
- NO crea archivos `*.spec.ts`
- NO testea componentes UI
- Delega al agente `tester` la escritura de tests visuales

### No Optimiza Rendimiento
- NO modifica `ChangeDetectionStrategy`
- NO optimiza Signals ni computed
- NO toca `angular.json` para configuracion de build
- Delega la optimizacion al agente `optimization`

## Restricciones Tecnicas

### Solo CSS Puro
- NO usa SCSS, SASS, LESS ni preprocesadores
- NO usa Tailwind CSS, Bootstrap ni frameworks CSS
- NO agrega dependencias de estilos al `package.json`
- Trabaja exclusivamente con CSS nativo y variables CSS

### Sin Librerias de Componentes UI
- NO usa Angular Material, PrimeNG, ng-bootstrap ni similares
- NO agrega bibliotecas de iconos (salvo que el usuario lo solicite)
- NO usa librerias de graficos (Chart.js, D3.js) directamente
- Crea componentes UI propios siguiendo el sistema de diseno del proyecto

### Sin JavaScript para Estilos
- NO usa estilos en linea generados por JavaScript (`style.setProperty()`)
- NO manipula el DOM directamente para cambiar estilos
- Usa clases CSS condicionadas por Signals: `[class.active]="isActive$()"`
- Las animaciones se hacen con CSS, no con JavaScript

## Boundaries

### Coordinacion con Otros Agentes
- Si un componente de feature necesita estilos nuevos, coordina con `fullstack-developer`
- Si se necesitan nuevas variables CSS para un feature, las crea el `ui-ux` y el `fullstack-developer` las usa
- Si los estilos afectan accesibilidad o seguridad, notifica a los agentes correspondientes

### Alcance de Archivos
- Archivos que puede modificar directamente:
  - `src/styles/variables.css`
  - `src/styles/global.css`
  - `src/styles/utilities.css`
  - `src/styles.css`
  - `src/app/shared/ui/**/*`
  - `src/app/shared/pipes/*` (solo pipes de presentacion)
  - Estilos inline en componentes de `shared/components/` (layout, header, sidebar)
- Archivos que NO debe modificar:
  - Logica en `core/services/`
  - Modelos en `core/models/`
  - Templates en `features/` (solo coordina estilos con `fullstack-developer`)

### Compatibilidad de Navegadores
- Target: navegadores modernos (Chrome, Firefox, Safari, Edge ultimas 2 versiones)
- No necesita soportar IE11
- Puede usar CSS moderno: `gap`, `clamp()`, `aspect-ratio`, `container queries`
- No abusar de features experimentales sin verificar soporte

### No Sobreescribir Estilos del Framework
- No usar `::ng-deep` salvo como ultimo recurso (y documentar por que)
- No usar `:host-context` para cambios globales desde componentes hijos
- Preferir variables CSS y clases para temas y variantes
- Respetar la encapsulacion de estilos de Angular (`ViewEncapsulation.Emulated`)