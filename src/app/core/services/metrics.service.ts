import { Injectable, signal, computed, inject } from '@angular/core';
import { JsonDatabaseService } from './json-database.service';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';

export interface MetricsData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembers: number;
  activeTeamMembers: number;
  projectHealth: number;
  teamUtilization: number;
  budgetSpent: number;
  budgetRemaining: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly metricsSource = signal<MetricsData | null>(null);
  private readonly dateRangeSource = signal<{ start: Date; end: Date }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });
  private readonly loadingSource = signal(false);

  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  // Computed signal que se actualiza automáticamente cuando cambian los proyectos o tareas
  readonly metrics = computed(() => {
    const projects = this.projectService.projects$();
    const tasks = this.taskService.tasks$();
    const teamMembers = this.jsonDb.getTeamMembers();

    const metrics: MetricsData = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'in-progress').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
      teamMembers: teamMembers.length,
      activeTeamMembers: teamMembers.filter(m => m.active).length,
      projectHealth: 85,
      teamUtilization: 72,
      budgetSpent: projects.reduce((sum, p) => sum + (p.spent || 0), 0),
      budgetRemaining: projects.reduce((sum, p) => sum + ((p.budget || 0) - (p.spent || 0)), 0)
    };

    return metrics;
  });

  readonly projectCompletionRate = computed(() => {
    const metrics = this.metrics();
    if (metrics.totalProjects === 0) return 0;
    return Math.round((metrics.completedProjects / metrics.totalProjects) * 100);
  });

  readonly taskCompletionRate = computed(() => {
    const metrics = this.metrics();
    if (metrics.totalTasks === 0) return 0;
    return Math.round((metrics.completedTasks / metrics.totalTasks) * 100);
  });

  readonly budgetUtilization = computed(() => {
    const metrics = this.metrics();
    if ((metrics.budgetSpent + metrics.budgetRemaining) === 0) return 0;
    return Math.round((metrics.budgetSpent / (metrics.budgetSpent + metrics.budgetRemaining)) * 100);
  });

  // Alias para compatibilidad con componentes existentes
  readonly metrics$ = this.metrics;
  readonly dateRange$ = this.dateRangeSource.asReadonly();
  readonly isLoading$ = this.loadingSource.asReadonly();

  constructor(private jsonDb: JsonDatabaseService) {}

  loadMetrics() {
    this.loadingSource.set(true);
    // Cargar datos desde los servicios (que a su vez cargan desde JsonDatabaseService)
    this.projectService.loadProjects();
    this.taskService.loadTasks();
    // Las métricas se actualizarán automáticamente mediante el computed signal
    this.loadingSource.set(false);
  }

  setDateRange(start: Date, end: Date) {
    this.dateRangeSource.set({ start, end });
    this.loadMetrics();
  }

  getMetricsSnapshot() {
    return this.metricsSource();
  }
}
