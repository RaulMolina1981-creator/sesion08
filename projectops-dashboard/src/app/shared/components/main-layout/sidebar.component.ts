import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StateService } from '../../../core/services/state.service';
import { TrashService } from '../../../core/services/trash.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.closed]="!(stateService.state$().sidebarOpen)">
      <nav class="nav-menu">
        <ul>
          <li>
            <a routerLink="/dashboard/projects" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }">
              <span class="icon">📊</span>
              <span class="label">Proyectos</span>
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/tasks" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }">
              <span class="icon">✓</span>
              <span class="label">Tareas</span>
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/team" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }">
              <span class="icon">👥</span>
              <span class="label">Equipo</span>
            </a>
          </li>
          <li>
            <a routerLink="/dashboard/metrics" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }">
              <span class="icon">📈</span>
              <span class="label">Métricas</span>
            </a>
          </li>
          <li class="nav-separator"></li>
          <li>
            <a routerLink="/dashboard/trash" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }">
              <span class="icon">🗑️</span>
              <span class="label">Papelera</span>
              <span class="badge-count" *ngIf="trashService.deletedCount() > 0">
                {{ trashService.deletedCount() }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      padding: 0;
      overflow-y: auto;
      overflow-x: hidden;
      transition: transform var(--transition-base), box-shadow var(--transition-base);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }

    html[data-theme="dark"] .sidebar,
    .dark-mode .sidebar {
      background-color: #0f172a;
      color: #f1f5f9;
      border-right-color: #1a1f2e;
    }

    .sidebar.closed {
      transform: translateX(-100%);
    }

    .nav-menu {
      list-style: none;
      padding: var(--spacing-md);
      margin: 0;
      flex: 1;
    }

    .nav-menu ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .nav-menu li {
      margin: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition-fast);
      border-radius: var(--radius-md);
      border-left: 3px solid transparent;
      font-weight: 500;
      position: relative;
    }

    html[data-theme="dark"] .nav-link,
    .dark-mode .nav-link {
      color: #cbd5e1;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: var(--accent-color);
      border-radius: 0 2px 2px 0;
      transition: height var(--transition-fast);
    }

    .nav-link:hover {
      background-color: var(--bg-hover);
      color: var(--text-primary);
      padding-left: calc(var(--spacing-md) + 2px);
    }

    html[data-theme="dark"] .nav-link:hover,
    .dark-mode .nav-link:hover {
      background-color: rgba(59, 130, 246, 0.1);
      color: #f1f5f9;
    }

    .nav-link.active {
      background-color: var(--bg-active);
      color: var(--accent-color);
      font-weight: 600;
    }

    html[data-theme="dark"] .nav-link.active,
    .dark-mode .nav-link.active {
      background-color: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    .nav-link.active::before {
      height: 24px;
    }

    .icon {
      margin-right: var(--spacing-md);
      font-size: 18px;
      line-height: 1;
      min-width: 24px;
      text-align: center;
    }

    .label {
      font-size: var(--font-size-sm);
      font-weight: 500;
    }

    .nav-separator {
      margin: var(--spacing-sm) var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }

    .badge-count {
      margin-left: auto;
      background-color: var(--error-color);
      color: white;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: var(--radius-full, 12px);
      min-width: 20px;
      text-align: center;
      line-height: 1.4;
    }
  `]
})
export class SidebarComponent implements OnInit {
  stateService = inject(StateService);
  trashService = inject(TrashService);

  ngOnInit() {
    this.trashService.loadDeletedItems();
  }
}
