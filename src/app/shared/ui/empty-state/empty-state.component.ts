import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon }}</div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button *ngIf="actionLabel" class="action-btn">{{ actionLabel }}</button>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--text-primary);
    }

    p {
      margin: 0 0 24px 0;
      font-size: 14px;
    }

    .action-btn {
      padding: 8px 16px;
      background-color: var(--accent-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .action-btn:hover {
      opacity: 0.9;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = '📭';
  @Input() title = 'No items';
  @Input() message = 'There are no items to display.';
  @Input() actionLabel: string | null = null;
}
