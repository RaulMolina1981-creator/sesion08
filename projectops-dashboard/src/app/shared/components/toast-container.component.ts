import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts$(); track toast.id) {
        <div
          class="toast"
          [class]="'toast toast-' + toast.type"
          (click)="toastService.dismiss(toast.id)"
        >
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id); $event.stopPropagation()">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1100;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      animation: slideInRight 0.3s ease-out;
      cursor: pointer;
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .toast-success { border-left: 4px solid var(--success-color); }
    .toast-error   { border-left: 4px solid var(--error-color); }
    .toast-warning { border-left: 4px solid var(--warning-color); }
    .toast-info    { border-left: 4px solid var(--info-color); }

    .toast-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
    }

    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      font-size: 18px;
      padding: 0 4px;
      line-height: 1;
    }

    .toast-close:hover {
      color: var(--text-primary);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '\u2705',
      error: '\u274C',
      warning: '\u26A0\uFE0F',
      info: '\u2139\uFE0F'
    };
    return icons[type] || '\u2139\uFE0F';
  }
}
