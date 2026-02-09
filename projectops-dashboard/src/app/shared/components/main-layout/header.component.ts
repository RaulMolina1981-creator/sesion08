import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="header-title">
          <span class="title-icon">✨</span>
          <h1>ProjectOps Dashboard</h1>
        </div>
        <div class="header-actions">
          <div class="theme-switch-container">
            <label class="theme-switch" [title]="isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
              <input
                type="checkbox"
                [checked]="isDarkMode"
                (change)="toggleTheme()"
              />
              <span class="switch-slider">
                <span class="icon">☀️</span>
                <span class="icon">🌙</span>
              </span>
            </label>
          </div>

          <!-- Notificaciones -->
          <div class="dropdown-wrapper">
            <button
              class="header-btn"
              title="Notificaciones"
              (click)="toggleNotifications($event)"
            >
              🔔
              @if (notifications.length > 0) {
                <span class="badge">{{ notifications.length }}</span>
              }
            </button>
            @if (showNotifications) {
              <div class="dropdown-panel notifications-panel">
                <div class="dropdown-header">
                  <span class="dropdown-title">Notificaciones</span>
                  @if (notifications.length > 0) {
                    <button class="clear-btn" (click)="clearAllNotifications()">Limpiar todo</button>
                  }
                </div>
                @if (notifications.length === 0) {
                  <div class="dropdown-empty">Sin notificaciones</div>
                } @else {
                  <div class="dropdown-list">
                    @for (n of notifications; track n.id) {
                      <div class="notification-item">
                        <span class="notif-icon" [class]="'notif-' + n.type">
                          {{ n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : n.type === 'error' ? '❌' : 'ℹ️' }}
                        </span>
                        <div class="notif-content">
                          <p class="notif-message">{{ n.message }}</p>
                          <span class="notif-time">{{ getTimeAgo(n.timestamp) }}</span>
                        </div>
                        <button class="notif-dismiss" (click)="dismissNotification(n.id, $event)">✕</button>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <!-- Perfil -->
          <div class="dropdown-wrapper">
            <button
              class="header-btn profile-btn"
              title="Perfil"
              (click)="toggleProfile($event)"
            >
              👤
            </button>
            @if (showProfile) {
              <div class="dropdown-panel profile-panel">
                <div class="profile-header">
                  <div class="profile-avatar">{{ userInitials }}</div>
                  <div class="profile-info">
                    <span class="profile-name">{{ user?.name || 'Usuario' }}</span>
                    <span class="profile-email">{{ user?.email || '' }}</span>
                    <span class="profile-role">{{ user?.role || '' }}</span>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-list">
                  <button class="menu-item" (click)="closeAll()">
                    <span>⚙️</span> Configuración
                  </button>
                  <button class="menu-item" (click)="closeAll()">
                    <span>📊</span> Mi actividad
                  </button>
                  <div class="dropdown-divider"></div>
                  <button class="menu-item menu-item-danger" (click)="closeAll()">
                    <span>🚪</span> Cerrar sesión
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-bottom: 2px solid #e2e8f0;
      padding: var(--spacing-md) var(--spacing-lg);
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
      position: sticky;
      top: 0;
      z-index: 100;
      transition: all var(--transition-base);
    }

    html[data-theme="dark"] .app-header,
    .dark-mode .app-header {
      background: #0a0f1a !important;
      border-bottom: 2px solid #1a1f2e !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 100%;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .title-icon {
      font-size: 24px;
      animation: fadeIn var(--transition-base);
    }

    h1 {
      margin: 0;
      font-size: var(--font-size-2xl);
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    html[data-theme="dark"] h1,
    .dark-mode h1 {
      color: #f1f5f9 !important;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .header-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background-color: var(--bg-primary);
      color: var(--text-secondary);
      font-size: 18px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    html[data-theme="dark"] .header-btn,
    .dark-mode .header-btn {
      background-color: rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(255, 255, 255, 0.15) !important;
      color: #f1f5f9 !important;
    }

    .header-btn:hover {
      background-color: var(--bg-hover);
      color: var(--accent-color);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    html[data-theme="dark"] .header-btn:hover,
    .dark-mode .header-btn:hover {
      background-color: rgba(255, 255, 255, 0.15) !important;
      color: #60a5fa !important;
    }

    .theme-switch-container {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .theme-switch {
      position: relative;
      display: inline-block;
      width: 56px;
      height: 32px;
      cursor: pointer;
    }

    .theme-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .switch-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #1e293b;
      transition: all var(--transition-fast);
      border-radius: 32px;
      border: 2px solid #1e293b;
      display: flex;
      align-items: center;
      padding: 0 4px;
      box-sizing: border-box;
    }

    .switch-slider::before {
      content: '';
      position: absolute;
      height: 24px;
      width: 24px;
      left: 3px;
      bottom: 2px;
      background-color: #f1f5f9;
      transition: all var(--transition-fast);
      border-radius: 50%;
      z-index: 2;
    }

    .switch-slider .icon {
      position: absolute;
      font-size: 14px;
      transition: opacity var(--transition-fast);
      z-index: 1;
    }

    .switch-slider .icon:first-of-type {
      left: 6px;
      opacity: 1;
    }

    .switch-slider .icon:last-of-type {
      right: 6px;
      opacity: 0.3;
    }

    input:checked + .switch-slider {
      background-color: #f1f5f9;
      border-color: #f1f5f9;
    }

    input:checked + .switch-slider::before {
      transform: translateX(24px);
      background-color: #1e293b;
    }

    input:checked + .switch-slider .icon:first-of-type {
      opacity: 0.3;
    }

    input:checked + .switch-slider .icon:last-of-type {
      opacity: 1;
    }

    .theme-switch:hover .switch-slider {
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }

    /* Badge de notificaciones */
    .header-btn {
      position: relative;
    }

    .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--error-color);
      color: white;
      font-size: 10px;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    /* Dropdown wrapper */
    .dropdown-wrapper {
      position: relative;
    }

    .dropdown-panel {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      z-index: var(--z-dropdown);
      min-width: 320px;
      animation: dropdownIn 0.15s ease-out;
      overflow: hidden;
    }

    @keyframes dropdownIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .dropdown-title {
      font-weight: 600;
      font-size: var(--font-size-base);
      color: var(--text-primary);
    }

    .clear-btn {
      background: none;
      border: none;
      color: var(--accent-color);
      font-size: var(--font-size-xs);
      cursor: pointer;
      font-weight: 500;
    }

    .clear-btn:hover {
      text-decoration: underline;
    }

    .dropdown-empty {
      padding: 32px 16px;
      text-align: center;
      color: var(--text-muted);
      font-size: var(--font-size-sm);
    }

    .dropdown-list {
      max-height: 300px;
      overflow-y: auto;
    }

    /* Notificaciones */
    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-light);
      transition: background var(--transition-fast);
    }

    .notification-item:hover {
      background: var(--bg-hover);
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notif-icon {
      font-size: 16px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .notif-content {
      flex: 1;
      min-width: 0;
    }

    .notif-message {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      line-height: var(--line-height-normal);
    }

    .notif-time {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .notif-dismiss {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }

    .notif-dismiss:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    /* Perfil */
    .profile-panel {
      min-width: 260px;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }

    .profile-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: var(--font-size-lg);
      flex-shrink: 0;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .profile-name {
      font-weight: 600;
      font-size: var(--font-size-base);
      color: var(--text-primary);
    }

    .profile-email {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .profile-role {
      font-size: var(--font-size-xs);
      color: var(--accent-color);
      font-weight: 500;
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-color);
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 16px;
      background: none;
      border: none;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      cursor: pointer;
      transition: background var(--transition-fast);
      text-align: left;
    }

    .menu-item:hover {
      background: var(--bg-hover);
    }

    .menu-item-danger {
      color: var(--error-color);
    }

    .menu-item-danger:hover {
      background: var(--error-light);
    }
  `]
})
export class HeaderComponent {
  stateService = inject(StateService);
  showNotifications = false;
  showProfile = false;

  get isDarkMode() {
    return this.stateService.state$().theme === 'dark';
  }

  get notifications() {
    return this.stateService.state$().notifications || [];
  }

  get user() {
    return this.stateService.state$().user;
  }

  get userInitials(): string {
    const name = this.user?.name || 'U';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.showNotifications = false;
    this.showProfile = false;
  }

  toggleTheme() {
    this.stateService.toggleTheme();
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  toggleProfile(event: Event) {
    event.stopPropagation();
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  dismissNotification(id: string, event: Event) {
    event.stopPropagation();
    this.stateService.removeNotification(id);
  }

  clearAllNotifications() {
    const ids = this.notifications.map(n => n.id);
    ids.forEach(id => this.stateService.removeNotification(id));
  }

  closeAll() {
    this.showNotifications = false;
    this.showProfile = false;
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Ahora mismo';
    if (diff < 60) return `Hace ${diff} min`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${Math.floor(hours / 24)}d`;
  }
}
