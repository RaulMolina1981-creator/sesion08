import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { DataInitializerService } from './core/services/data-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('auth_token');
          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next(req);
        }
      ])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: (dataInitializer: DataInitializerService) => () => dataInitializer.initializeDatabase(),
      deps: [DataInitializerService],
      multi: true
    }
  ]
};
