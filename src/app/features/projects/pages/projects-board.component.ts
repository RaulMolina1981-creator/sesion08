import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ModalService } from '../../../core/services/modal.service';
import { Project, CreateProjectDTO } from '../../../core/models/project.model';
import { LoadingSpinnerComponent, EmptyStateComponent } from '../../../shared/ui';
import { CreateProjectFormComponent } from '../components/create-project-form.component';

@Component({
  selector: 'app-projects-board',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="projects-container">
      <!-- Header con estadísticas -->
      <div class="projects-header">
        <div class="header-content">
          <h2>Proyectos</h2>
          <p class="subtitle">{{ projectMetrics().total }} total • {{ projectMetrics().active }} activos</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" routerLink="kanban" title="Vista Kanban">📊 Kanban</button>
          <button class="btn-secondary" (click)="projectService.loadProjects()" title="Actualizar proyectos">🔄 Actualizar</button>
          <button class="btn-primary" (click)="onCreateProject()">+ Nuevo Proyecto</button>
        </div>
      </div>

      <!-- Tarjetas de estadísticas rápidas -->
      <div class="metrics-summary">
        <div class="stat-card">
          <span class="stat-icon">📊</span>
          <div class="stat-content">
            <p class="stat-label">Tasa de Completación</p>
            <p class="stat-value">{{ projectMetrics().completionRate }}%</p>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⏳</span>
          <div class="stat-content">
            <p class="stat-label">A Tiempo</p>
            <p class="stat-value">{{ projectMetrics().onTime }}</p>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">💰</span>
          <div class="stat-content">
            <p class="stat-label">Presupuesto Gastado</p>
            <p class="stat-value">\${{ projectMetrics().budgetSpent | number }}</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner
        *ngIf="projectService.isLoading$()"
        message="Cargando proyectos..."
      ></app-loading-spinner>

      <!-- Empty State -->
      <app-empty-state
        *ngIf="!projectService.isLoading$() && projectService.projects$().length === 0"
        icon="📋"
        title="Sin proyectos aún"
        message="Comienza creando tu primer proyecto."
        actionLabel="Crear Proyecto"
      ></app-empty-state>

      <!-- Proyectos Grid -->
      <div class="projects-grid" *ngIf="!projectService.isLoading$() && projectService.projects$().length > 0">
        <div
          *ngFor="let project of projectService.projects$()"
          class="project-card"
          [class.status-completed]="project.status === 'completed'"
          [class.status-blocked]="project.status === 'blocked'"
        >
          <!-- Header de la tarjeta -->
          <div class="card-header">
            <h3>{{ project.name }}</h3>
            <span class="status-badge" [ngClass]="'status-' + project.status">
              {{ project.status }}
            </span>
          </div>

          <!-- Descripción -->
          <p class="card-description">{{ project.description }}</p>

          <!-- Progreso -->
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Progreso</span>
              <span class="progress-value">{{ project.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="project.progress"></div>
            </div>
          </div>

          <!-- Información del proyecto -->
          <div class="project-info">
            <div class="info-item">
              <span class="info-label">Gestor</span>
              <span class="info-value">{{ project.manager }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tamaño del Equipo</span>
              <span class="info-value">{{ project.teamSize }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Presupuesto</span>
              <span class="info-value">\${{ project.spent | number }} / \${{ project.budget | number }}</span>
            </div>
          </div>

          <!-- Footer con acciones -->
          <div class="card-footer">
            <button class="btn-secondary" (click)="onViewProject(project)">Ver Detalles</button>
            <button class="btn-danger" (click)="onDeleteProject(project.id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-container {
      padding: 0;
      max-width: 1400px;
      margin: 0 auto;
      animation: slideInUp var(--transition-base);
    }

    .projects-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      gap: 24px;
      padding: var(--spacing-xl);
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
      border-bottom: 1px solid var(--border-color);
    }

    .header-content h2 {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 4px 0;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      margin: 0;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .btn-primary {
      padding: 12px 24px;
      background: var(--gradient-primary);
      color: white;
      border-radius: var(--radius-md);
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all var(--transition-fast);
      white-space: nowrap;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .btn-secondary {
      padding: 12px 20px;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-secondary:hover {
      background-color: var(--bg-hover);
      border-color: var(--accent-color);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .metrics-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
      padding: 0 var(--spacing-xl);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-fast);
      animation: slideInUp var(--transition-base);
    }

    .stat-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
      border-color: var(--accent-color);
    }

    .stat-icon {
      font-size: 32px;
      animation: pulse 2s ease-in-out infinite;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      margin: 0;
      font-size: 12px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .stat-value {
      margin: 6px 0 0 0;
      font-size: 24px;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      padding: 0 var(--spacing-xl) var(--spacing-xl);
    }

    .project-card {
      display: flex;
      flex-direction: column;
      padding: 20px;
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);
      animation: slideInUp var(--transition-base);
      position: relative;
      overflow: hidden;
    }

    .project-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--gradient-primary);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--transition-fast);
    }

    .project-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-8px);
      border-color: var(--accent-color);
    }

    .project-card:hover::before {
      transform: scaleX(1);
    }

    .project-card.status-completed {
      border-left: 4px solid var(--success-color);
    }

    .project-card.status-blocked {
      border-left: 4px solid var(--error-color);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }

    .card-header h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      flex: 1;
      color: var(--text-primary);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 12px;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
      letter-spacing: 0.5px;
    }

    .status-badge.status-pending {
      background-color: var(--warning-light);
      color: var(--warning-color);
    }

    .status-badge.status-in-progress {
      background-color: var(--info-light);
      color: var(--info-color);
    }

    .status-badge.status-completed {
      background-color: var(--success-light);
      color: var(--success-color);
    }

    .status-badge.status-blocked {
      background-color: var(--error-light);
      color: var(--error-color);
    }

    .card-description {
      margin: 0 0 16px 0;
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.5;
    }

    .progress-section {
      margin-bottom: 16px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .progress-label {
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .progress-value {
      font-size: 14px;
      font-weight: 700;
      color: var(--accent-color);
    }

    .progress-bar {
      height: 8px;
      background-color: var(--border-color);
      border-radius: var(--radius-full);
      overflow: hidden;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .progress-fill {
      height: 100%;
      background: var(--gradient-primary);
      transition: width var(--transition-base);
      border-radius: var(--radius-full);
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }

    .project-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .info-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .info-value {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .card-footer {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }

    .card-footer .btn-secondary {
      flex: 1;
      padding: 8px 12px;
      background-color: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--text-primary);
    }

    .card-footer .btn-secondary:hover {
      background-color: var(--bg-hover);
      border-color: var(--accent-color);
      color: var(--accent-color);
    }

    .btn-danger {
      flex: 1;
      padding: 8px 12px;
      background-color: var(--error-light);
      border: 1px solid var(--error-color);
      border-radius: var(--radius-md);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--error-color);
    }

    .btn-danger:hover {
      background-color: var(--error-color);
      border-color: var(--error-color);
      color: white;
    }

    @media (max-width: 768px) {
      .projects-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header-actions {
        width: 100%;
        flex-wrap: wrap;
      }

      .btn-primary {
        align-self: flex-start;
      }

      .projects-grid {
        grid-template-columns: 1fr;
      }

      .project-info {
        grid-template-columns: 1fr;
      }

      .metrics-summary {
        padding: 0 var(--spacing-lg);
      }
    }
  `]
})
export class ProjectsBoardComponent implements OnInit {
  projectService = inject(ProjectService);
  private modalService = inject(ModalService);

  // Computed para métricas
  readonly projectMetrics = computed(() => {
    const projects = this.projectService.projects$();
    const total = projects.length;
    const active = projects.filter(p => p.status === 'in-progress').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const avgProgress = total > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / total) : 0;
    const onTime = projects.filter(p => p.endDate > new Date()).length;

    return {
      total,
      active,
      completed,
      completionRate,
      avgProgress,
      budgetSpent: totalSpent,
      budgetRemaining: totalBudget - totalSpent,
      onTime
    };
  });

  ngOnInit() {
    // Cargar proyectos desde la base de datos
    this.projectService.loadProjects();

    // Debug: mostrar proyectos en consola
    console.log('Proyectos cargados:', this.projectService.projects$());
  }

  onCreateProject() {
    this.modalService.open({
      component: 'project',
      onConfirm: (data: CreateProjectDTO) => {
        this.projectService.createProject(data);
        // Recargar proyectos después de crear
        setTimeout(() => {
          this.projectService.loadProjects();
        }, 100);
      },
      onCancel: () => {
        // Modal cancelado
      }
    });
  }

  onViewProject(project: any) {
    alert(`Proyecto: ${project.name}\n\nDetalles: ${project.description}`);
  }

  onDeleteProject(projectId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      this.projectService.deleteProject(projectId);
      alert('Proyecto eliminado correctamente');
    }
  }

  // Función para limpiar cache y recargar (para debugging)
  resetAndReload() {
    localStorage.removeItem('projectops_db');
    window.location.reload();
  }
}
