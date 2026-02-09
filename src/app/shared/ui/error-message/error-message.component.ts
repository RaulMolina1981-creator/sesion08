import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container" *ngIf="message">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <p class="error-text">{{ message }}</p>
        <button *ngIf="dismissible" (click)="onDismiss()" class="dismiss-btn">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      padding: 12px 16px;
      background-color: #fee;
      border: 1px solid #fcc;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .error-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .error-text {
      margin: 0;
      color: #c33;
      font-size: 14px;
      flex: 1;
    }

    .dismiss-btn {
      background: none;
      border: none;
      color: #c33;
      cursor: pointer;
      font-size: 16px;
      padding: 0 4px;
      flex-shrink: 0;
    }

    .dismiss-btn:hover {
      color: #933;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
  @Input() dismissible = true;
  @Output() dismissed = new EventEmitter<void>();

  onDismiss() {
    this.dismissed.emit();
  }
}
