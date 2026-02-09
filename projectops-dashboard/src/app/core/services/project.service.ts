import { Injectable, signal, computed } from '@angular/core';
import { JsonDatabaseService } from './json-database.service';
import { Project, CreateProjectDTO, UpdateProjectDTO } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly projectsSource = signal<Project[]>([]);
  private readonly selectedProjectIdSource = signal<string | null>(null);
  private readonly loadingSource = signal(false);

  readonly projects$ = this.projectsSource.asReadonly();
  readonly selectedProjectId$ = this.selectedProjectIdSource.asReadonly();
  readonly isLoading$ = this.loadingSource.asReadonly();

  readonly selectedProject = computed(() => {
    const id = this.selectedProjectIdSource();
    return id ? this.projectsSource().find(p => p.id === id) : null;
  });

  readonly projectCount = computed(() => this.projectsSource().length);

  readonly activeProjects = computed(() =>
    this.projectsSource().filter(p => p.status === 'in-progress')
  );

  constructor(private jsonDb: JsonDatabaseService) {}

  loadProjects() {
    this.loadingSource.set(true);
    const projects = this.jsonDb.getProjects();
    this.projectsSource.set(projects);
    this.loadingSource.set(false);

    // En producción, descomenta esto:
    // this.apiService.get<Project[]>('/projects').subscribe({
    //   next: (projects) => {
    //     this.projectsSource.set(projects);
    //     this.loadingSource.set(false);
    //   },
    //   error: (err) => {
    //     console.error('Error loading projects:', err);
    //     this.loadingSource.set(false);
    //   }
    // });
  }

  getProjectById(id: string) {
    this.loadingSource.set(true);
    const project = this.jsonDb.getProjectById(id);
    if (project) {
      this.selectedProjectIdSource.set(id);
      const projects = this.projectsSource();
      const index = projects.findIndex(p => p.id === id);
      if (index > -1) {
        projects[index] = project;
        this.projectsSource.set([...projects]);
      }
    }
    this.loadingSource.set(false);
  }

  createProject(project: CreateProjectDTO) {
    this.loadingSource.set(true);
    const newProject = this.jsonDb.createProject(project);
    this.projectsSource.set([...this.projectsSource(), newProject]);
    this.loadingSource.set(false);
  }

  updateProject(id: string, updates: UpdateProjectDTO) {
    this.loadingSource.set(true);
    const updatedProject = this.jsonDb.updateProject(id, updates);
    if (updatedProject) {
      const projects = this.projectsSource();
      const index = projects.findIndex(p => p.id === id);
      if (index > -1) {
        projects[index] = updatedProject;
        this.projectsSource.set([...projects]);
      }
    }
    this.loadingSource.set(false);
  }

  deleteProject(id: string) {
    this.loadingSource.set(true);
    this.jsonDb.deleteProject(id);
    this.projectsSource.set(
      this.projectsSource().filter(p => p.id !== id)
    );
    if (this.selectedProjectIdSource() === id) {
      this.selectedProjectIdSource.set(null);
    }
    this.loadingSource.set(false);
  }

  restoreProject(id: string) {
    this.loadingSource.set(true);
    this.jsonDb.restoreProject(id);
    this.loadProjects();
    this.loadingSource.set(false);
  }

  permanentDeleteProject(id: string) {
    this.loadingSource.set(true);
    this.jsonDb.permanentDeleteProject(id);
    this.loadingSource.set(false);
  }

  selectProject(id: string) {
    this.selectedProjectIdSource.set(id);
  }

  clearSelection() {
    this.selectedProjectIdSource.set(null);
  }
}
