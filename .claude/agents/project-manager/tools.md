# Project Manager - Herramientas

## Herramientas de Analisis

### Lectura de Archivos del Proyecto
```bash
# Revisar estructura actual del proyecto
ls src/app/core/models/
ls src/app/core/services/
ls src/app/features/
ls src/app/shared/

# Revisar rutas configuradas
cat src/app/app.routes.ts

# Revisar configuracion de la app
cat src/app/app.config.ts

# Revisar modelos existentes
cat src/app/core/models/project.model.ts
cat src/app/core/models/task.model.ts
cat src/app/core/models/team-member.model.ts
cat src/app/core/models/status.model.ts
```

### Verificacion de Estado del Proyecto
```bash
# Verificar que compila sin errores
ng build

# Verificar que los tests pasan
ng test --watch=false

# Verificar errores de lint
ng lint

# Iniciar servidor de desarrollo
ng serve
```

### Busqueda en el Codigo
```bash
# Buscar donde se usa un modelo/servicio/componente
grep -r "ProjectService" src/app/
grep -r "import.*from.*@core" src/app/

# Buscar archivos de un tipo especifico
find src/app -name "*.component.ts"
find src/app -name "*.service.ts"
find src/app -name "*.spec.ts"
```

## Herramientas de Gestion

### Registro de Decisiones
- Documentar las decisiones arquitectonicas tomadas
- Mantener un registro de que agente hizo que tarea
- Reportar al usuario el estado de la implementacion

### Validacion de Integridad
```bash
# Verificar que no hay imports rotos
ng build --configuration=production

# Verificar que los path aliases funcionan
cat tsconfig.json | grep -A 10 "paths"

# Verificar que las rutas lazy-loaded cargan correctamente
ng serve  # y navegar por la aplicacion
```

## Herramientas de Delegacion

### Invocacion de Agentes
Cada agente se invoca proporcionando:
1. **Contexto**: Archivos relevantes y estado actual del proyecto
2. **Tarea**: Descripcion clara de lo que debe hacer
3. **Restricciones**: Patrones a seguir, archivos que no debe modificar
4. **Criterio de aceptacion**: Como validar que la tarea esta completa

### Ejemplo de Delegacion
```
→ database: "Crea el modelo `Report` con interfaces y DTOs en core/models/report.model.ts"
→ fullstack-developer: "Crea ReportService en core/services/ siguiendo el patron de ProjectService"
→ fullstack-developer: "Crea la pagina reports-dashboard.component.ts en features/reports/pages/"
→ ui-ux: "Aplica estilos consistentes con el dashboard de metricas"
→ tester: "Escribe tests para ReportService y ReportsDashboardComponent"
→ documentation: "Documenta la nueva funcionalidad de reportes"
```

## Archivos de Referencia del Orquestador

| Archivo | Proposito |
|---------|-----------|
| `.claude/agents/project.json` | Definicion de todos los agentes y workflows |
| `src/app/app.routes.ts` | Mapa de rutas de la aplicacion |
| `src/app/app.config.ts` | Providers y configuracion global |
| `angular.json` | Configuracion del proyecto Angular |
| `tsconfig.json` | Configuracion de TypeScript y path aliases |
| `package.json` | Dependencias y scripts disponibles |