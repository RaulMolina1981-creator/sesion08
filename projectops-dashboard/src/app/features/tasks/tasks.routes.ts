import { Routes } from '@angular/router';
import { TasksListComponent } from './pages/tasks-list.component';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TasksListComponent
  }
];
