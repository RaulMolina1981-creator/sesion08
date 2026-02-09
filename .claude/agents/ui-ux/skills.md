# UI/UX - Habilidades

## Sistema de Diseno con CSS Variables

### Definicion de Variables
```css
/* En src/styles/variables.css */
:root {
  /* Nuevas variables siguen la convencion existente */
  --color-nuevo: #hexvalue;
  --spacing-nuevo: Xrem;
  --nuevo-propiedad: valor;
}

/* Variables para dark mode */
[data-theme="dark"] {
  --color-primary: #valor-dark;
  --color-background: #1a1a2e;
  --color-surface: #16213e;
  --color-text: #e4e4e4;
}
```

### Uso Consistente de Variables
```css
/* CORRECTO: usar variables */
.card {
  background: var(--color-surface);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-family);
}

/* INCORRECTO: valores hardcoded */
.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
}
```

## Componentes UI Reutilizables

### Creacion de Componentes UI
Ubicacion: `src/app/shared/ui/<nombre>/`

Patron estandar:
```typescript
@Component({
  selector: 'app-nombre-ui',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nombre-ui" [class]="variantClass()">
      <ng-content />
    </div>
  `,
  styles: [`
    .nombre-ui {
      /* Usar siempre variables CSS */
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
    }
    .nombre-ui.primary { background: var(--color-primary); }
    .nombre-ui.secondary { background: var(--color-secondary); }
  `]
})
export class NombreUiComponent {
  variant = input<'primary' | 'secondary'>('primary');
  readonly variantClass = computed(() => this.variant());
}
```

### Componentes UI Existentes a Mantener

| Componente | Selector | Proposito |
|------------|----------|-----------|
| `ButtonComponent` | `app-button` | Boton generico con variantes |
| `PrimaryButtonComponent` | `app-primary-button` | Boton de accion principal |
| `LoadingSpinnerComponent` | `app-loading-spinner` | Indicador de carga |
| `EmptyStateComponent` | `app-empty-state` | Mensaje cuando no hay datos |
| `ErrorMessageComponent` | `app-error-message` | Mensaje de error |

## Layout Responsive

### Grid System con CSS Grid
```css
.grid-container {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Flexbox Utilities
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
```

## Sistema de Temas (Dark/Light Mode)

### Implementacion con CSS Variables
```css
/* Light theme (default) */
:root {
  --color-background: #f5f5f5;
  --color-surface: #ffffff;
  --color-text: #333333;
  --color-text-secondary: #666666;
  --color-border: #e0e0e0;
}

/* Dark theme */
[data-theme="dark"] {
  --color-background: #1a1a2e;
  --color-surface: #16213e;
  --color-text: #e4e4e4;
  --color-text-secondary: #a0a0a0;
  --color-border: #2a2a4a;
}
```

### Toggle de Tema
```typescript
// En StateService
toggleTheme(): void {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  this.currentTheme$.set(next);
}
```

## Accesibilidad (WCAG 2.1)

### Contraste de Colores
- Ratio minimo texto normal: 4.5:1
- Ratio minimo texto grande: 3:1
- Verificar con herramientas como Chrome DevTools > Accessibility

### Navegacion por Teclado
- Todos los elementos interactivos deben ser focusables
- Orden de tab logico (tabindex solo cuando sea necesario)
- Indicador de foco visible (`:focus-visible`)

### ARIA
```html
<button aria-label="Eliminar proyecto">
  <span class="icon">X</span>
</button>

<div role="status" aria-live="polite">
  {{ mensaje$() }}
</div>

<nav aria-label="Navegacion principal">
  <!-- sidebar links -->
</nav>
```

## Animaciones y Transiciones

```css
/* Transiciones suaves para interacciones */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Fade in para contenido cargado */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

## Pipes de Presentacion

### StatusBadgePipe
```typescript
// Transforma StatusType en badge con clase CSS
// 'pending' → <span class="badge badge-pending">Pendiente</span>
// 'in-progress' → <span class="badge badge-active">En Progreso</span>
```

### DateFormatPipe
```typescript
// Formato de fechas localizado para la UI
// new Date() → "9 Feb 2026"
```