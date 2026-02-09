import { Component, inject, OnInit, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalContainerComponent } from './shared/components/modal-container.component';
import { StateService } from './core/services/state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-modal-container></app-modal-container>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'projectops-dashboard';
  private stateService = inject(StateService);

  constructor() {
    // Aplicar cambios de tema reactivamente
    effect(() => {
      const theme = this.stateService.state$().theme;
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    });
  }

  ngOnInit() {
    // Aplicar tema inicial
    const initialTheme = this.stateService.state$().theme;
    document.documentElement.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  }
}
