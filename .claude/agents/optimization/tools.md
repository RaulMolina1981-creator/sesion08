# Optimization - Herramientas

## Comandos de Build y Analisis

```bash
# Build de produccion
ng build --configuration=production

# Build con estadisticas de bundle
ng build --configuration=production --stats-json

# Analizar bundle con source-map-explorer
npx source-map-explorer dist/browser/*.js

# Ver tamanios de archivos generados
ls -la dist/browser/

# Verificar que budgets se cumplen
ng build --configuration=production  # Falla si excede budgets
```

## Comandos de Inspeccion de Codigo

```bash
# Buscar componentes sin OnPush
grep -rL "ChangeDetectionStrategy.OnPush" src/app/features/ --include="*.component.ts"

# Buscar componentes CON OnPush
grep -rl "ChangeDetectionStrategy.OnPush" src/app/ --include="*.component.ts"

# Buscar BehaviorSubject (candidatos a migrar a Signals)
grep -r "BehaviorSubject" src/app/ --include="*.ts"

# Buscar subscribe (posibles memory leaks)
grep -r "\.subscribe(" src/app/ --include="*.ts"

# Buscar *ngIf/*ngFor legacy (migrar a @if/@for)
grep -r "\*ngIf" src/app/ --include="*.ts"
grep -r "\*ngFor" src/app/ --include="*.ts"

# Buscar imports de modulos completos
grep -r "import \*" src/app/ --include="*.ts"

# Buscar funciones llamadas en templates (performance issue)
grep -r "{{ [a-zA-Z]*(" src/app/ --include="*.ts"

# Buscar effects que podrian ser computed
grep -r "effect(" src/app/ --include="*.ts"

# Buscar signals no usados
grep -r "signal(" src/app/ --include="*.ts"
```

## Inspeccion de Configuracion

```bash
# Revisar configuracion de build
cat angular.json

# Revisar budgets configurados
grep -A 10 "budgets" angular.json

# Revisar configuracion de TypeScript
cat tsconfig.json
cat tsconfig.app.json

# Revisar dependencias (identificar las pesadas)
cat package.json

# Ver tamanio de node_modules
du -sh node_modules/
```

## Herramientas de Browser (DevTools)

```javascript
// Performance API - medir tiempos de carga
performance.getEntriesByType('navigation')[0].toJSON();

// Medir tiempo de un bloque de codigo
performance.mark('start');
// ... codigo ...
performance.mark('end');
performance.measure('operacion', 'start', 'end');
console.log(performance.getEntriesByName('operacion')[0].duration + 'ms');

// Verificar memoria usada
performance.memory; // Solo Chrome

// Contar change detection cycles (Angular DevTools)
// Usar la extension Angular DevTools del navegador
```

## Lighthouse (via Chrome DevTools)

```bash
# Ejecutar Lighthouse desde CLI
npx lighthouse http://localhost:4200 --output=json --output-path=./lighthouse-report.json

# Metricas clave a revisar:
# - Performance Score (objetivo: > 90)
# - First Contentful Paint
# - Largest Contentful Paint
# - Time to Interactive
# - Total Blocking Time
# - Cumulative Layout Shift
```

## Verificacion de Lazy Loading

```bash
# Verificar que los features se cargan como chunks separados
ng build --configuration=production
ls dist/browser/chunk-*.js

# Buscar imports directos que deberian ser lazy
grep -r "import.*from.*features" src/app/app --include="*.ts"

# Verificar rutas con loadChildren
grep -r "loadChildren" src/app/ --include="*.ts"
grep -r "loadComponent" src/app/ --include="*.ts"
```

## Patrones de Refactorizacion de Rendimiento

### Agregar OnPush a un Componente
```typescript
// Agregar import
import { ChangeDetectionStrategy } from '@angular/core';

// Agregar al decorador
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### Migrar Observable a Signal
```typescript
// ANTES
private data$ = new BehaviorSubject<Data[]>([]);
getData(): Observable<Data[]> { return this.data$.asObservable(); }

// DESPUES
readonly data$ = signal<Data[]>([]);
// Los consumidores acceden directamente: service.data$()
```

### Optimizar computed con memoizacion natural
```typescript
// computed() ya memoriza automaticamente
// Solo se recalcula si sus dependencias cambian
readonly expensiveComputation = computed(() => {
  const items = this.items$();
  return items.filter(i => i.active).sort((a, b) => a.name.localeCompare(b.name));
});
```

## Archivos de Configuracion a Optimizar

| Archivo | Que Optimizar |
|---------|---------------|
| `angular.json` | budgets, optimization, sourceMap, aot |
| `tsconfig.json` | strict, noUnusedLocals, noUnusedParameters |
| `package.json` | eliminar dependencias innecesarias |
| `src/app/app.routes.ts` | lazy loading de todos los features |