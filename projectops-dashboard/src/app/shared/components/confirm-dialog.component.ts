import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (confirmService.isOpen$()) {
      <div class="overlay" (click)="confirmService.cancel()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <span class="dialog-icon">{{ confirmService.config$()?.icon || '\u26A0\uFE0F' }}</span>
            <h3>{{ confirmService.config$()?.title || 'Confirmar' }}</h3>
          </div>
          <p class="dialog-message">{{ confirmService.config$()?.message }}</p>
          <div class="dialog-actions">
            <app-button variant="secondary" size="md" (clicked)="confirmService.cancel()">
              {{ confirmService.config$()?.cancelText || 'Cancelar' }}
            </app-button>
            <app-button
              [variant]="confirmService.config$()?.confirmVariant || 'danger'"
              size="md"
              (clicked)="confirmService.confirm()"
            >
              {{ confirmService.config$()?.confirmText || 'Eliminar' }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      animation: fadeIn 0.2s ease-out;
    }

    .dialog {
      background-color: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: 28px;
      width: 90%;
      max-width: 440px;
      box-shadow: var(--shadow-lg);
      animation: slideUp 0.2s ease-out;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .dialog-icon {
      font-size: 28px;
    }

    .dialog-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .dialog-message {
      margin: 0 0 24px 0;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ConfirmDialogComponent {
  confirmService = inject(ConfirmDialogService);
}
