# Security - Herramientas

## Comandos de Auditoria

```bash
# Auditar dependencias npm por vulnerabilidades
npm audit

# Auditar con detalle completo
npm audit --json

# Ver dependencias desactualizadas
npm outdated

# Verificar que no hay secrets en el codigo
grep -r "password" src/ --include="*.ts"
grep -r "secret" src/ --include="*.ts"
grep -r "api_key" src/ --include="*.ts"
grep -r "token" src/ --include="*.ts" -l
```

## Analisis de Codigo Estatico

```bash
# Buscar uso de innerHTML (potencial XSS)
grep -r "innerHTML" src/app/ --include="*.ts"
grep -r "bypassSecurityTrust" src/app/ --include="*.ts"

# Buscar uso de eval (ejecucion arbitraria)
grep -r "eval(" src/app/ --include="*.ts"
grep -r "Function(" src/app/ --include="*.ts"

# Buscar URLs hardcodeadas
grep -r "http://" src/app/ --include="*.ts"
grep -r "https://" src/app/ --include="*.ts"

# Buscar console.log en produccion
grep -r "console\." src/app/ --include="*.ts"

# Buscar uso de any (debilita tipado)
grep -r ": any" src/app/ --include="*.ts"
grep -r "as any" src/app/ --include="*.ts"
```

## Revision de Archivos de Seguridad

```bash
# Revisar interceptor de API
cat src/app/core/interceptors/api.interceptor.ts

# Revisar configuracion de la app (providers de seguridad)
cat src/app/app.config.ts

# Revisar directiva de permisos
cat src/app/shared/directives/has-permission.directive.ts

# Revisar servicio de API
cat src/app/core/services/api.service.ts

# Revisar variables de entorno
cat .env.example
```

## Verificacion de Configuracion de Build

```bash
# Verificar configuracion de produccion
cat angular.json | grep -A 20 '"production"'

# Verificar que sourceMap esta deshabilitado en produccion
grep -r "sourceMap" angular.json

# Verificar CSP headers en index.html
cat src/index.html | grep -i "content-security-policy"

# Verificar configuracion de despliegue
cat netlify.toml
cat vercel.json
```

## Herramientas de Analisis en Navegador

```javascript
// Verificar que no hay datos sensibles en LocalStorage
Object.keys(localStorage).forEach(key => {
  console.log(key, typeof localStorage.getItem(key));
});

// Verificar cookies
document.cookie;

// Verificar headers de respuesta (desde DevTools > Network)
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// Content-Security-Policy: ...
```

## Patrones de Correccion

### Sanitizar Input de Usuario
```typescript
import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const sanitizer = inject(DomSanitizer);
const safe = sanitizer.sanitize(SecurityContext.HTML, userInput);
```

### Validar Datos de LocalStorage
```typescript
function validateProjectData(data: unknown): data is Project {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['name'] === 'string' &&
    typeof obj['status'] === 'string' &&
    ['pending', 'in-progress', 'completed', 'blocked', 'cancelled'].includes(obj['status'] as string)
  );
}
```

### Proteger Rutas con Guards
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
  return true;
};
```

## Archivos a Revisar por Prioridad

| Prioridad | Archivo | Razon |
|-----------|---------|-------|
| Alta | `api.interceptor.ts` | Manejo de tokens y credenciales |
| Alta | `api.service.ts` | URLs y configuracion HTTP |
| Media | `json-database.service.ts` | Parsing de datos de LocalStorage |
| Media | `*-form.component.ts` | Inputs del usuario |
| Baja | `*.component.ts` | Templates con datos dinamicos |
| Baja | `angular.json` | Configuracion de build |