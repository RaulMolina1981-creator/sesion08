import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)"
    >
      <span *ngIf="loading" class="spinner"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: var(--font-primary);
      font-weight: 500;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      position: relative;
      outline: none;
    }

    button:focus-visible {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Sizes */
    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
      min-height: 28px;
    }

    .btn-md {
      padding: 8px 16px;
      font-size: 14px;
      min-height: 36px;
    }

    .btn-lg {
      padding: 12px 24px;
      font-size: 16px;
      min-height: 44px;
    }

    /* Variants - Light Mode */
    .btn-primary {
      background-color: var(--accent-color);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--accent-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-secondary {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--bg-hover);
      border-color: var(--accent-color);
      transform: translateY(-1px);
    }

    .btn-success {
      background-color: var(--success-color);
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #059669;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    .btn-danger {
      background-color: var(--error-color);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }

    .btn-warning {
      background-color: var(--warning-color);
      color: white;
    }

    .btn-warning:hover:not(:disabled) {
      background-color: #d97706;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--text-primary);
      border: 1px solid transparent;
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: var(--bg-hover);
      border-color: var(--border-color);
    }

    /* Dark Mode Overrides */
    html[data-theme="dark"] .btn-primary,
    .dark-mode .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    html[data-theme="dark"] .btn-primary:hover:not(:disabled),
    .dark-mode .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    html[data-theme="dark"] .btn-secondary,
    .dark-mode .btn-secondary {
      background-color: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      color: #f1f5f9;
    }

    html[data-theme="dark"] .btn-secondary:hover:not(:disabled),
    .dark-mode .btn-secondary:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: #3b82f6;
    }

    html[data-theme="dark"] .btn-ghost,
    .dark-mode .btn-ghost {
      color: #f1f5f9;
    }

    html[data-theme="dark"] .btn-ghost:hover:not(:disabled),
    .dark-mode .btn-ghost:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    /* Loading Spinner */
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Full Width */
    .btn-full {
      width: 100%;
    }

    /* Icon Only */
    .btn-icon-only {
      padding: 8px;
      min-width: 36px;
    }

    .btn-icon-only.btn-sm {
      padding: 6px;
      min-width: 28px;
    }

    .btn-icon-only.btn-lg {
      padding: 12px;
      min-width: 44px;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() iconOnly = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`
    ];

    if (this.fullWidth) {
      classes.push('btn-full');
    }

    if (this.iconOnly) {
      classes.push('btn-icon-only');
    }

    return classes.join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
