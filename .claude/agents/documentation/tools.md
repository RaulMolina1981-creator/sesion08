# Documentation - Herramientas

## Inspeccion del Proyecto

```bash
# Ver estructura general del proyecto
ls src/app/
ls src/app/core/
ls src/app/features/
ls src/app/shared/

# Ver archivos de documentacion existentes
ls *.md

# Revisar documentacion actual
cat README.md
cat DEPLOYMENT.md
cat INICIO_RAPIDO.md
cat CAMBIOS_REALIZADOS.md
cat RESUMEN_IMPLEMENTACION.md

# Ver package.json para informacion del proyecto
cat package.json
```

## Inspeccion de Codigo para Documentar

```bash
# Ver modelos (para documentar interfaces)
cat src/app/core/models/project.model.ts
cat src/app/core/models/task.model.ts
cat src/app/core/models/team-member.model.ts
cat src/app/core/models/status.model.ts

# Ver servicios (para documentar APIs)
cat src/app/core/services/project.service.ts
cat src/app/core/services/task.service.ts
cat src/app/core/services/team.service.ts
cat src/app/core/services/metrics.service.ts
cat src/app/core/services/json-database.service.ts
cat src/app/core/services/state.service.ts

# Ver rutas (para documentar navegacion)
cat src/app/app.routes.ts
cat src/app/features/projects/projects.routes.ts
cat src/app/features/tasks/tasks.routes.ts
cat src/app/features/team/team.routes.ts
cat src/app/features/metrics/metrics.routes.ts

# Ver configuracion (para documentar setup)
cat angular.json
cat tsconfig.json
cat package.json
```

## Busqueda de Codigo Sin Documentar

```bash
# Buscar servicios sin JSDoc
grep -rL "@Injectable" src/app/core/services/ --include="*.ts" | head -20

# Buscar interfaces sin comentarios
grep -B1 "export interface" src/app/core/models/ --include="*.ts"

# Buscar metodos publicos sin JSDoc
grep -n "^\s*[a-z].*(.*):" src/app/core/services/ --include="*.ts"

# Buscar componentes de pagina (necesitan documentacion)
grep -rl "pages/" src/app/features/ --include="*.ts"

# Ver que archivos se han modificado recientemente
git log --oneline -10
git diff --name-only HEAD~5
```

## Generacion de Documentacion

### Crear/Actualizar README.md
```markdown
Contenido obligatorio:
1. Titulo y descripcion del proyecto
2. Badges (build status, version, coverage)
3. Screenshot o demo
4. Requisitos previos
5. Instalacion
6. Uso / Arranque
7. Estructura del proyecto
8. Tecnologias
9. Scripts disponibles
10. Contribucion
```

### Crear ADR (Architectural Decision Record)
```
Ubicacion: docs/adr/
Formato: ADR-NNN-titulo.md
Contenido: Contexto, Decision, Razones, Consecuencias
```

### Agregar JSDoc a un Servicio
```typescript
/**
 * [Descripcion breve del servicio]
 *
 * [Descripcion detallada si es necesario]
 *
 * @example
 * ```typescript
 * const service = inject(NombreService);
 * service.loadItems();
 * ```
 *
 * @see {@link JsonDatabaseService} para detalles de persistencia
 */
```

## Verificacion de Documentacion

```bash
# Verificar que README existe y no esta vacio
wc -l README.md

# Verificar que los links en README son validos
grep -o "\[.*\](.*)" README.md

# Verificar que los ejemplos de codigo compilan
# (extraer bloques typescript y verificar sintaxis)
ng build  # compilar para verificar que el codigo documentado es correcto

# Buscar TODOs pendientes de documentar
grep -rn "TODO" src/app/ --include="*.ts"
grep -rn "FIXME" src/app/ --include="*.ts"
grep -rn "HACK" src/app/ --include="*.ts"
```

## Formato de Escritura

### Markdown
- Usar encabezados jerarquicos (`#`, `##`, `###`)
- Usar tablas para listas de referencia
- Usar bloques de codigo con syntax highlighting
- Usar listas para enumeraciones y pasos

### Idioma
- Toda la documentacion se escribe en **espanol**
- Los nombres de codigo (variables, funciones, archivos) se mantienen en ingles
- Los comentarios JSDoc en **espanol**

## Archivos de Referencia

| Archivo | Proposito |
|---------|-----------|
| `README.md` | Documentacion principal |
| `DEPLOYMENT.md` | Guia de despliegue |
| `INICIO_RAPIDO.md` | Guia de inicio rapido |
| `CAMBIOS_REALIZADOS.md` | Changelog |
| `RESUMEN_IMPLEMENTACION.md` | Resumen tecnico |
| `.claude/agents/project.json` | Definicion del sistema de agentes |