import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">⚙️</span>
        <span class="logo-text">ProjectOps</span>
      </div>
      <nav class="nav">
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.path"
          routerLinkActive="active"
          class="nav-item"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      background-color: var(--bg-secondary);
      border-right: 1px solid var(--border-color);
      height: 100vh;
      overflow-y: auto;
      padding: 24px 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 24px;
      margin-bottom: 32px;
    }

    .logo-icon {
      font-size: 24px;
    }

    .logo-text {
      font-weight: 700;
      font-size: 16px;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      color: var(--text-secondary);
      text-decoration: none;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background-color: var(--bg-hover);
      color: var(--text-primary);
    }

    .nav-item.active {
      background-color: var(--bg-active);
      color: var(--accent-color);
      border-left-color: var(--accent-color);
    }

    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }

    .nav-label {
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Projects', path: '/dashboard/projects', icon: '📊' },
    { label: 'Tasks', path: '/dashboard/tasks', icon: '✓' },
    { label: 'Team', path: '/dashboard/team', icon: '👥' },
    { label: 'Metrics', path: '/dashboard/metrics', icon: '📈' }
  ];
}
