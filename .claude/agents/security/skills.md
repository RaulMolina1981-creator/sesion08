# Security - Habilidades

## Prevencion de XSS (Cross-Site Scripting)

### Verificacion de Templates
- Detectar uso de `innerHTML` sin sanitizacion con `DomSanitizer`
- Verificar que no se usa `bypassSecurityTrustHtml()` sin justificacion
- Asegurar que Angular sanitiza automaticamente los bindings `{{ }}` y `[property]`
- Revisar uso de `@HostBinding` con valores dinamicos

### Patron Seguro
```typescript
// SEGURO: Angular sanitiza automaticamente
<p>{{ userInput }}</p>
<div [textContent]="userInput"></div>

// PELIGROSO: bypass de seguridad
<div [innerHTML]="userInput"></div>

// SI ES NECESARIO innerHTML, sanitizar:
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
readonly sanitizer = inject(DomSanitizer);
readonly safeContent = computed(() =>
  this.sanitizer.sanitize(SecurityContext.HTML, this.rawContent()) || ''
);
```

## Validacion de Inputs

### Formularios
- Verificar que todos los campos tienen validaciones apropiadas
- Validar longitud maxima de strings para prevenir DoS de almacenamiento
- Sanitizar caracteres especiales en campos de texto libre
- Validar formatos de email, fechas, numeros

### Patron de Validacion
```typescript
// Validaciones en formulario reactivo
this.form = this.fb.group({
  name: ['', [Validators.required, Validators.maxLength(100)]],
  email: ['', [Validators.required, Validators.email]],
  description: ['', [Validators.maxLength(500)]],
  budget: [0, [Validators.min(0), Validators.max(9999999)]]
});
```

## Seguridad del Interceptor HTTP

### Revision de api.interceptor.ts
- Verificar que el Bearer token se envia solo a URLs de confianza
- Asegurar que no se envian credenciales a dominios externos
- Verificar headers de seguridad: `X-Content-Type-Options`, `X-Frame-Options`
- Revisar manejo de errores 401/403 (redireccion a login)

### Patron de Interceptor Seguro
```typescript
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const allowedOrigins = ['http://localhost:3000'];
  const url = new URL(req.url, window.location.origin);

  if (allowedOrigins.some(origin => url.origin === origin)) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
  }

  return next(req);
};
```

## Seguridad de LocalStorage

### Riesgos Identificados
- Datos almacenados en texto plano (visible en DevTools)
- Sin validacion de esquema al leer datos
- Vulnerable a manipulacion manual por el usuario
- Sin cifrado de datos sensibles

### Mitigaciones Recomendadas
- Validar estructura de datos al leer de LocalStorage
- No almacenar tokens ni credenciales en LocalStorage
- Implementar checksums para detectar manipulacion
- Considerar cifrado basico para datos sensibles

## Auditoria de Dependencias

- Revisar `package.json` por dependencias con vulnerabilidades conocidas
- Verificar que Angular y TypeScript estan en versiones con parches de seguridad
- No usar dependencias abandonadas o sin mantenimiento

## Checklist de Auditoria OWASP (Top 10 para SPA)

1. **Inyeccion**: Verificar que no hay inyeccion SQL/NoSQL (N/A: no hay backend)
2. **Autenticacion rota**: Revisar interceptor y manejo de tokens
3. **Exposicion de datos**: Verificar que no se exponen datos sensibles en el cliente
4. **XXE**: N/A (no se procesa XML)
5. **Control de acceso roto**: Revisar directiva `hasPermission` y rutas protegidas
6. **Configuracion insegura**: Revisar `angular.json` y configuracion de produccion
7. **XSS**: Verificar templates y uso de innerHTML
8. **Deserializacion insegura**: Verificar parsing de JSON desde LocalStorage
9. **Componentes vulnerables**: Auditar dependencias con `npm audit`
10. **Logging insuficiente**: Verificar que errores se registran correctamente

## Formato de Reporte de Auditoria

```
## Auditoria de Seguridad: [modulo/componente]

### Vulnerabilidades Encontradas

#### CRITICA (accion inmediata)
- [CVE/Tipo]: [descripcion] → [solucion]

#### ALTA (corregir pronto)
- [Tipo]: [descripcion] → [solucion]

#### MEDIA (planificar correccion)
- [Tipo]: [descripcion] → [solucion]

#### BAJA (mejora recomendada)
- [Tipo]: [descripcion] → [solucion]

### Puntuacion de Seguridad: X/10
```