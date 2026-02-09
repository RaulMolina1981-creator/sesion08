import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/projects',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    children: [
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
      },
      {
        path: 'tasks',
        loadChildren: () =>
          import('./features/tasks/tasks.routes').then(m => m.TASKS_ROUTES)
      },
      {
        path: 'team',
        loadChildren: () =>
          import('./features/team/team.routes').then(m => m.TEAM_ROUTES)
      },
      {
        path: 'metrics',
        loadChildren: () =>
          import('./features/metrics/metrics.routes').then(m => m.METRICS_ROUTES)
      },
      {
        path: 'trash',
        loadChildren: () =>
          import('./features/trash/trash.routes').then(m => m.TRASH_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard/projects'
  }
];
