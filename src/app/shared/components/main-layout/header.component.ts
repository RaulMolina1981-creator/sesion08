import { Component, inject } from '@angular/core';
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
          <button class="header-btn" title="Notificaciones">🔔</button>
          <button class="header-btn" title="Perfil">👤</button>
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
  `]
})
export class HeaderComponent {
  stateService = inject(StateService);

  get isDarkMode() {
    return this.stateService.state$().theme === 'dark';
  }

  toggleTheme() {
    this.stateService.toggleTheme();
  }
}
