import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button class="menu-btn" (click)="onToggleSidebar()">
          <span>☰</span>
        </button>
        <h1>ProjectOps Dashboard</h1>
      </div>
      <div class="header-right">
        <button class="theme-btn" (click)="onToggleTheme()">
          {{ stateService.state$().theme === 'light' ? '🌙' : '☀️' }}
        </button>
        <div class="user-menu">
          <span>{{ stateService.state$().user?.name || 'User' }}</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background-color: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      height: 64px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-btn,
    .theme-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
    }

    .menu-btn:hover,
    .theme-btn:hover {
      background-color: var(--bg-hover);
    }

    h1 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    .user-menu {
      padding: 8px 12px;
      border-radius: 4px;
      background-color: var(--bg-hover);
    }
  `]
})
export class HeaderComponent {
  stateService = inject(StateService);

  onToggleSidebar() {
    this.stateService.toggleSidebar();
  }

  onToggleTheme() {
    this.stateService.toggleTheme();
  }
}
