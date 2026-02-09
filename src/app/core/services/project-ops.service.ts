import { Injectable, signal, computed, effect } from '@angular/core';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';
import { TeamService } from './team.service';
import { MetricsService } from './metrics.service';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { TeamMember } from '../models/team-member.model';

/**
 * ProjectOpsService - Servicio centralizado que orquesta
 * proyectos, tareas y equipo con signals y métricas computadas
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectOpsService {
  // Signals privados
  private readonly projectsSource = signal<Project[]>([]);
  private readonly tasksSource = signal<Task[]>([]);
  private readonly teamMembersSource = signal<TeamMember[]>([]);
  private readonly selectedProjectIdSource = signal<string | null>(null);
  private readonly isLoadingSource = signal(false);

  // Signals públicos de solo lectura
  readonly projects$ = this.projectsSource.asReadonly();
  readonly tasks$ = this.tasksSource.asReadonly();
  readonly teamMembers$ = this.teamMembersSource.asReadonly();
  readonly selectedProjectId$ = this.selectedProjectIdSource.asReadonly();
  readonly isLoading$ = this.isLoadingSource.asReadonly();

  // Computed Signals - Proyecto seleccionado
  readonly selectedProject = computed(() => {
    const id = this.selectedProjectIdSource();
    return id ? this.projectsSource().find(p => p.id === id) : null;
  });

  // Computed Signals - Conteos
  readonly projectCount = computed(() => this.projectsSource().length);
  readonly taskCount = computed(() => this.tasksSource().length);
  readonly teamMemberCount = computed(() => this.teamMembersSource().length);

  // Computed Signals - Proyectos por estado
  readonly activeProjects = computed(() =>
    this.projectsSource().filter(p => p.status === 'in-progress')
  );

  readonly completedProjects = computed(() =>
    this.projectsSource().filter(p => p.status === 'completed')
  );

  readonly pendingProjects = computed(() =>
    this.projectsSource().filter(p => p.status === 'pending')
  );

  // Computed Signals - Tareas por estado
  readonly incompleteTasks = computed(() =>
    this.tasksSource().filter(t => !t.completed)
  );

  readonly completedTasks = computed(() =>
    this.tasksSource().filter(t => t.completed)
  );

  // Computed Signals - Métricas clave
  readonly totalProjectProgress = computed(() => {
    const projects = this.projectsSource();
    if (projects.length === 0) return 0;
    const avgProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length;
    return Math.round(avgProgress);
  });

  readonly taskCompletionRate = computed(() => {
    const tasks = this.tasksSource();
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  });

  readonly teamUtilization = computed(() => {
    const members = this.teamMembersSource();
    if (members.length === 0) return 0;
    const assignedTasks = members.reduce((sum, m) => sum + (m.assignedTasks || 0), 0);
    const maxCapacity = members.length * 10; // Asumir max 10 tareas por persona
    return Math.round((assignedTasks / maxCapacity) * 100);
  });

  readonly projectsOverdue = computed(() => {
    const now = new Date();
    return this.projectsSource().filter(p =>
      p.endDate && new Date(p.endDate) < now && p.status !== 'completed'
    );
  });

  readonly activeMembersCount = computed(() =>
    this.teamMembersSource().filter(m => m.isActive).length
  );

  readonly highPriorityTasks = computed(() =>
    this.tasksSource().filter(t => t.priority === 'high' && !t.completed)
  );

  // Dashboard Summary - Computed signal que agrupa todas las métricas
  readonly dashboardSummary = computed(() => ({
    totalProjects: this.projectCount(),
    activeProjects: this.activeProjects().length,
    completedProjects: this.completedProjects().length,
    pendingProjects: this.pendingProjects().length,
    totalTasks: this.taskCount(),
    completedTasks: this.completedTasks().length,
    incompleteTasks: this.incompleteTasks().length,
    taskCompletionRate: this.taskCompletionRate(),
    totalTeamMembers: this.teamMemberCount(),
    activeMembers: this.activeMembersCount(),
    teamUtilization: this.teamUtilization(),
    projectProgress: this.totalProjectProgress(),
    overdueTasks: this.projectsOverdue().length,
    highPriorityTasks: this.highPriorityTasks().length
  }));

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private teamService: TeamService,
    private metricsService: MetricsService
  ) {
    this.initializeSyncEffects();
  }

  /**
   * Sincroniza los datos de los servicios individuales
   */
  private initializeSyncEffects() {
    effect(() => {
      this.projectsSource.set(this.projectService.projects$());
    });

    effect(() => {
      this.tasksSource.set(this.taskService.tasks$());
    });

    effect(() => {
      this.teamMembersSource.set(this.teamService.teamMembers$());
    });

    effect(() => {
      this.isLoadingSource.set(
        this.projectService.isLoading$() ||
        this.taskService.isLoading$() ||
        this.teamService.isLoading$()
      );
    });
  }

  /**
   * Carga todos los datos necesarios
   */
  loadAll() {
    this.projectService.loadProjects();
    this.taskService.loadTasks();
    this.teamService.loadTeamMembers();
  }

  /**
   * Setters para proyectos
   */
  setProjects(projects: Project[]) {
    this.projectsSource.set(projects);
  }

  addProject(project: Project) {
    this.projectsSource.set([...this.projectsSource(), project]);
  }

  updateProject(id: string, updates: Partial<Project>) {
    const projects = this.projectsSource();
    const index = projects.findIndex(p => p.id === id);
    if (index > -1) {
      projects[index] = { ...projects[index], ...updates };
      this.projectsSource.set([...projects]);
    }
  }

  removeProject(id: string) {
    this.projectsSource.set(
      this.projectsSource().filter(p => p.id !== id)
    );
  }

  /**
   * Setters para tareas
   */
  setTasks(tasks: Task[]) {
    this.tasksSource.set(tasks);
  }

  addTask(task: Task) {
    this.tasksSource.set([...this.tasksSource(), task]);
  }

  updateTask(id: string, updates: Partial<Task>) {
    const tasks = this.tasksSource();
    const index = tasks.findIndex(t => t.id === id);
    if (index > -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.tasksSource.set([...tasks]);
    }
  }

  removeTask(id: string) {
    this.tasksSource.set(
      this.tasksSource().filter(t => t.id !== id)
    );
  }

  /**
   * Setters para equipo
   */
  setTeamMembers(members: TeamMember[]) {
    this.teamMembersSource.set(members);
  }

  addTeamMember(member: TeamMember) {
    this.teamMembersSource.set([...this.teamMembersSource(), member]);
  }

  updateTeamMember(id: string, updates: Partial<TeamMember>) {
    const members = this.teamMembersSource();
    const index = members.findIndex(m => m.id === id);
    if (index > -1) {
      members[index] = { ...members[index], ...updates };
      this.teamMembersSource.set([...members]);
    }
  }

  removeTeamMember(id: string) {
    this.teamMembersSource.set(
      this.teamMembersSource().filter(m => m.id !== id)
    );
  }

  /**
   * Selección y navegación
   */
  selectProject(id: string) {
    this.selectedProjectIdSource.set(id);
  }

  clearProjectSelection() {
    this.selectedProjectIdSource.set(null);
  }

  /**
   * Métodos de utilidad
   */
  getTasksByProject(projectId: string): Task[] {
    return this.tasksSource().filter(t => t.projectId === projectId);
  }

  getTeamMembersByProject(projectId: string): TeamMember[] {
    const tasks = this.getTasksByProject(projectId);
    const memberIds = new Set(tasks.map(t => t.assigneeId).filter(Boolean));
    return this.teamMembersSource().filter(m => memberIds.has(m.id));
  }

  reset() {
    this.projectsSource.set([]);
    this.tasksSource.set([]);
    this.teamMembersSource.set([]);
    this.selectedProjectIdSource.set(null);
  }
}
