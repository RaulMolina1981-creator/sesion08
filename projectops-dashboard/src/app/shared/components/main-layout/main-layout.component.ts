import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-wrapper">
      <app-header></app-header>
      <div class="app-container" [class.sidebar-closed]="!(stateService.state$().sidebarOpen)">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <div class="content-area">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-wrapper {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }

    .app-container {
      display: grid;
      grid-template-columns: 250px 1fr;
      flex: 1;
      overflow: hidden;
      transition: grid-template-columns var(--transition-base);
    }

    .app-container.sidebar-closed {
      grid-template-columns: 0 1fr;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: var(--bg-secondary);
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-lg);
      animation: slideInUp var(--transition-base);
      background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
    }

    /* Scrollbar styling - Hidden */
    .content-area::-webkit-scrollbar {
      display: none;
    }

    .content-area {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
  `]
})
export class MainLayoutComponent {
  stateService = inject(StateService);
}
