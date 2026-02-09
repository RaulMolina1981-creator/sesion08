# UI/UX - Herramientas

## Inspeccion de Estilos Actuales

```bash
# Ver variables CSS definidas
cat src/styles/variables.css

# Ver estilos globales
cat src/styles/global.css

# Ver utilidades CSS
cat src/styles/utilities.css

# Ver punto de entrada de estilos
cat src/styles.css

# Buscar estilos hardcodeados (sin variables CSS)
grep -r "color: #" src/app/ --include="*.ts"
grep -r "padding: [0-9]" src/app/ --include="*.ts"
grep -r "margin: [0-9]" src/app/ --include="*.ts"
grep -r "font-size: [0-9]" src/app/ --include="*.ts"
```

## Inspeccion de Componentes UI

```bash
# Ver componentes UI existentes
ls src/app/shared/ui/

# Revisar componentes especificos
cat src/app/shared/ui/button/button.component.ts
cat src/app/shared/ui/button/primary-button.component.ts
cat src/app/shared/ui/loading-spinner/loading-spinner.component.ts
cat src/app/shared/ui/empty-state/empty-state.component.ts
cat src/app/shared/ui/error-message/error-message.component.ts

# Ver layout components
cat src/app/shared/components/main-layout/main-layout.component.ts
cat src/app/shared/components/header/header.component.ts
cat src/app/shared/components/sidebar/sidebar.component.ts

# Ver pipes de presentacion
cat src/app/shared/pipes/date-format.pipe.ts
cat src/app/shared/pipes/status-badge.pipe.ts
```

## Busqueda de Inconsistencias Visuales

```bash
# Buscar valores hardcodeados que deberian ser variables
grep -r "border-radius:" src/app/ --include="*.ts" | grep -v "var("
grep -r "box-shadow:" src/app/ --include="*.ts" | grep -v "var("
grep -r "font-family:" src/app/ --include="*.ts" | grep -v "var("

# Buscar colores hardcodeados
grep -rn "#[0-9a-fA-F]\{3,6\}" src/app/ --include="*.ts"

# Buscar media queries inconsistentes
grep -r "@media" src/app/ --include="*.ts"

# Buscar !important (indicador de problemas de especificidad)
grep -r "!important" src/app/ --include="*.ts"
grep -r "!important" src/styles/
```

## Herramientas de Desarrollo Visual

### Servidor de Desarrollo
```bash
# Iniciar app para verificar visualmente
ng serve --open

# Iniciar en puerto especifico
ng serve --port 4201
```

### Chrome DevTools (instrucciones para el desarrollador)
```
1. Elements > Styles: Inspeccionar CSS computado
2. Elements > Computed: Ver todas las propiedades finales
3. Lighthouse > Accessibility: Auditoria de accesibilidad
4. Device Toolbar: Simular diferentes pantallas
5. Elements > Accessibility: Arbol de accesibilidad
6. Rendering > CSS media: Simular preferencias de usuario
```

## Operaciones sobre Archivos de Estilo

### Agregar Nueva Variable CSS
Editar `src/styles/variables.css`:
```css
:root {
  /* ... variables existentes ... */
  --nueva-variable: valor;
}

[data-theme="dark"] {
  --nueva-variable: valor-dark;
}
```

### Agregar Clase de Utilidad
Editar `src/styles/utilities.css`:
```css
.nueva-utilidad { propiedad: var(--variable); }
```

### Crear Nuevo Componente UI
Ubicacion: `src/app/shared/ui/<nombre>/`
```bash
# Estructura de archivos a crear
src/app/shared/ui/<nombre>/
  <nombre>.component.ts
  index.ts
```

## Herramientas de Accesibilidad

```bash
# Buscar imagenes sin alt
grep -r "<img" src/app/ --include="*.ts" | grep -v "alt="

# Buscar botones sin label/aria-label
grep -r "<button" src/app/ --include="*.ts" | grep -v "aria-label"

# Buscar elementos interactivos sin roles
grep -r "click)" src/app/ --include="*.ts" | grep -v "<button\|<a "

# Buscar formularios sin labels
grep -r "<input" src/app/ --include="*.ts" | grep -v "aria-label\|id="
```

## Verificacion de Responsive

```bash
# Buscar componentes con anchos fijos que podrian romper responsive
grep -r "width: [0-9]*px" src/app/ --include="*.ts"
grep -r "max-width:" src/app/ --include="*.ts"

# Buscar uso de flexbox y grid
grep -r "display: flex" src/app/ --include="*.ts"
grep -r "display: grid" src/app/ --include="*.ts"
```

## Archivos de Referencia

| Archivo | Proposito |
|---------|-----------|
| `src/styles/variables.css` | Fuente de verdad para variables CSS |
| `src/styles/global.css` | Estilos base de la aplicacion |
| `src/styles/utilities.css` | Clases de utilidad reutilizables |
| `src/index.html` | Meta viewport, fonts, CDN links |