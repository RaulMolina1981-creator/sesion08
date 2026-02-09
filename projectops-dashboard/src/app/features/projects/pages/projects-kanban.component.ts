import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { ModalService } from '../../../core/services/modal.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';
import { TrashService } from '../../../core/services/trash.service';
import { Project } from '../../../core/models/project.model';
import { LoadingSpinnerComponent, ButtonComponent } from '../../../shared/ui';

@Component({
  selector: 'app-projects-kanban',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ButtonComponent],
  template: `
    <div class="kanban-container">
      <!-- Header -->
      <div class="kanban-header">
        <div class="header-content">
          <h2>Vista Kanban</h2>
          <p class="subtitle">Arrastra proyectos para cambiar su estado</p>
        </div>
        <button class="btn-primary" (click)="onCreateProject()">+ Nuevo Proyecto</button>
      </div>

      <app-loading-spinner
        *ngIf="projectService.isLoading$()"
        message="Cargando proyectos..."
      ></app-loading-spinner>

      <div class="kanban-board" *ngIf="!projectService.isLoading$()">
        <!-- Columna: Pendiente -->
        <div class="kanban-column">
          <div class="column-header">
            <h3>📋 Pendiente</h3>
            <span class="column-count">{{ getProjectsByStatus('pending').length }}</span>
          </div>
          <div
            class="kanban-drop-zone"
            [class.drag-over]="dragOverColumn() === 'pending'"
            (drop)="onDrop('pending', $event)"
            (dragover)="onDragOver('pending', $event); $event.preventDefault(); $event.dataTransfer!.dropEffect='move'"
            (dragleave)="onDragLeave()"
          >
            <div
              *ngFor="let project of getProjectsByStatus('pending')"
              class="kanban-card"
              draggable="true"
              (dragstart)="onDragStart(project)"
              (dragend)="onDragEnd()"
            >
              <div class="card-actions">
                <app-button
                  variant="secondary"
                  size="sm"
                  (clicked)="onEditProject(project); $event.stopPropagation()"
                >
                  Editar
                </app-button>
                <app-button
                  variant="danger"
                  size="sm"
                  (clicked)="onDeleteProject(project.id); $event.stopPropagation()"
                >
                  Eliminar
                </app-button>
              </div>
              <div class="card-header">
                <h4>{{ project.name }}</h4>
                <span class="card-badge pending">{{ project.status }}</span>
              </div>
              <p class="card-description">{{ project.description }}</p>
              <div class="card-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="project.progress"></div>
                </div>
                <span class="progress-text">{{ project.progress }}%</span>
              </div>
              <div class="card-meta">
                <span class="meta-item">👤 {{ project.manager }}</span>
                <span class="meta-item">👥 {{ project.teamSize }}</span>
              </div>
            </div>
            <div class="empty-state" *ngIf="getProjectsByStatus('pending').length === 0">
              Arrastra proyectos aquí
            </div>
          </div>
        </div>

        <!-- Columna: En Progreso -->
        <div class="kanban-column">
          <div class="column-header">
            <h3>⚙️ En Progreso</h3>
            <span class="column-count">{{ getProjectsByStatus('in-progress').length }}</span>
          </div>
          <div
            class="kanban-drop-zone"
            [class.drag-over]="dragOverColumn() === 'in-progress'"
            (drop)="onDrop('in-progress', $event)"
            (dragover)="onDragOver('in-progress', $event); $event.preventDefault(); $event.dataTransfer!.dropEffect='move'"
            (dragleave)="onDragLeave()"
          >
            <div
              *ngFor="let project of getProjectsByStatus('in-progress')"
              class="kanban-card"
              draggable="true"
              (dragstart)="onDragStart(project)"
              (dragend)="onDragEnd()"
            >
              <div class="card-actions">
                <app-button
                  variant="secondary"
                  size="sm"
                  (clicked)="onEditProject(project); $event.stopPropagation()"
                >
                  Editar
                </app-button>
                <app-button
                  variant="danger"
                  size="sm"
                  (clicked)="onDeleteProject(project.id); $event.stopPropagation()"
                >
                  Eliminar
                </app-button>
              </div>
              <div class="card-header">
                <h4>{{ project.name }}</h4>
                <span class="card-badge in-progress">{{ project.status }}</span>
              </div>
              <p class="card-description">{{ project.description }}</p>
              <div class="card-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="project.progress"></div>
                </div>
                <span class="progress-text">{{ project.progress }}%</span>
              </div>
              <div class="card-meta">
                <span class="meta-item">👤 {{ project.manager }}</span>
                <span class="meta-item">👥 {{ project.teamSize }}</span>
              </div>
            </div>
            <div class="empty-state" *ngIf="getProjectsByStatus('in-progress').length === 0">
              Arrastra proyectos aquí
            </div>
          </div>
        </div>

        <!-- Columna: Completado -->
        <div class="kanban-column">
          <div class="column-header">
            <h3>✅ Completado</h3>
            <span class="column-count">{{ getProjectsByStatus('completed').length }}</span>
          </div>
          <div
            class="kanban-drop-zone"
            [class.drag-over]="dragOverColumn() === 'completed'"
            (drop)="onDrop('completed', $event)"
            (dragover)="onDragOver('completed', $event); $event.preventDefault(); $event.dataTransfer!.dropEffect='move'"
            (dragleave)="onDragLeave()"
          >
            <div
              *ngFor="let project of getProjectsByStatus('completed')"
              class="kanban-card"
              draggable="true"
              (dragstart)="onDragStart(project)"
              (dragend)="onDragEnd()"
            >
              <div class="card-actions">
                <app-button
                  variant="secondary"
                  size="sm"
                  (clicked)="onEditProject(project); $event.stopPropagation()"
                >
                  Editar
                </app-button>
                <app-button
                  variant="danger"
                  size="sm"
                  (clicked)="onDeleteProject(project.id); $event.stopPropagation()"
                >
                  Eliminar
                </app-button>
              </div>
              <div class="card-header">
                <h4>{{ project.name }}</h4>
                <span class="card-badge completed">{{ project.status }}</span>
              </div>
              <p class="card-description">{{ project.description }}</p>
              <div class="card-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="project.progress"></div>
                </div>
                <span class="progress-text">{{ project.progress }}%</span>
              </div>
              <div class="card-meta">
                <span class="meta-item">👤 {{ project.manager }}</span>
                <span class="meta-item">👥 {{ project.teamSize }}</span>
              </div>
            </div>
            <div class="empty-state" *ngIf="getProjectsByStatus('completed').length === 0">
              Arrastra proyectos aquí
            </div>
          </div>
        </div>

        <!-- Columna: Cancelado -->
        <div class="kanban-column">
          <div class="column-header">
            <h3>❌ Cancelado</h3>
            <span class="column-count">{{ getProjectsByStatus('cancelled').length }}</span>
          </div>
          <div
            class="kanban-drop-zone"
            [class.drag-over]="dragOverColumn() === 'cancelled'"
            (drop)="onDrop('cancelled', $event)"
            (dragover)="onDragOver('cancelled', $event); $event.preventDefault(); $event.dataTransfer!.dropEffect='move'"
            (dragleave)="onDragLeave()"
          >
            <div
              *ngFor="let project of getProjectsByStatus('cancelled')"
              class="kanban-card"
              draggable="true"
              (dragstart)="onDragStart(project)"
              (dragend)="onDragEnd()"
            >
              <div class="card-actions">
                <app-button
                  variant="secondary"
                  size="sm"
                  (clicked)="onEditProject(project); $event.stopPropagation()"
                >
                  Editar
                </app-button>
                <app-button
                  variant="danger"
                  size="sm"
                  (clicked)="onDeleteProject(project.id); $event.stopPropagation()"
                >
                  Eliminar
                </app-button>
              </div>
              <div class="card-header">
                <h4>{{ project.name }}</h4>
                <span class="card-badge cancelled">{{ project.status }}</span>
              </div>
              <p class="card-description">{{ project.description }}</p>
              <div class="card-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="project.progress"></div>
                </div>
                <span class="progress-text">{{ project.progress }}%</span>
              </div>
              <div class="card-meta">
                <span class="meta-item">👤 {{ project.manager }}</span>
                <span class="meta-item">👥 {{ project.teamSize }}</span>
              </div>
            </div>
            <div class="empty-state" *ngIf="getProjectsByStatus('cancelled').length === 0">
              Arrastra proyectos aquí
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kanban-container {
      padding: 24px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .kanban-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header-content h2 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    .subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }

    .btn-primary {
      padding: 10px 20px;
      background-color: var(--accent-color);
      color: white;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: background-color var(--transition-fast);
    }

    .btn-primary:hover {
      background-color: var(--accent-hover);
    }

    .kanban-board {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      overflow-x: auto;
      padding-bottom: 16px;
    }

    .kanban-column {
      display: flex;
      flex-direction: column;
      height: fit-content;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--border-color);
    }

    .column-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .column-count {
      display: inline-block;
      min-width: 24px;
      height: 24px;
      padding: 0 6px;
      background-color: var(--bg-secondary);
      color: var(--text-secondary);
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kanban-drop-zone {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 200px;
      padding: 12px;
      background-color: var(--bg-secondary);
      border: 2px dashed var(--border-color);
      border-radius: 8px;
      transition: all var(--transition-fast);
    }

    .kanban-drop-zone.drag-over {
      background-color: var(--bg-active);
      border-color: var(--accent-color);
      box-shadow: inset 0 0 8px rgba(37, 99, 235, 0.1);
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      color: var(--text-muted);
      font-size: 13px;
      text-align: center;
    }

    .kanban-card {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      cursor: grab;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
      position: relative;
    }

    .kanban-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .kanban-card:active {
      cursor: grabbing;
      opacity: 0.7;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 8px;
      position: relative;
    }

    .card-header h4 {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
      flex: 1;
    }

    .card-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .card-badge.pending {
      background-color: var(--warning-light);
      color: var(--warning-color);
    }

    .card-badge.in-progress {
      background-color: var(--info-light);
      color: var(--info-color);
    }

    .card-badge.completed {
      background-color: var(--success-light);
      color: var(--success-color);
    }

    .card-badge.cancelled {
      background-color: var(--error-light);
      color: var(--error-color);
    }

    /* Dark mode overrides for badges */
    html[data-theme="dark"] .card-badge.pending {
      background-color: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }

    html[data-theme="dark"] .card-badge.in-progress {
      background-color: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }

    html[data-theme="dark"] .card-badge.completed {
      background-color: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }

    html[data-theme="dark"] .card-badge.cancelled {
      background-color: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    .card-description {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 0 0 12px 0;
      line-height: 1.4;
    }

    .card-progress {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background-color: var(--bg-secondary);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background-color: var(--success-color);
      border-radius: 3px;
    }

    .progress-text {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      min-width: 30px;
    }

    .card-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: var(--text-muted);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      position: absolute;
      bottom: 12px;
      right: 12px;
    }


    /* Responsive Design */
    @media (max-width: 1024px) {
      .kanban-board {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header-actions {
        width: 100%;
        flex-wrap: wrap;
      }

      .kanban-board {
        grid-template-columns: 1fr;
      }

      .card-header {
        flex-wrap: wrap;
        gap: 8px;
      }

      .card-actions {
        position: relative;
        top: auto;
        right: auto;
        width: 100%;
        margin-top: 8px;
      }

      .card-actions app-button {
        flex: 1;
      }
    }

    @media (max-width: 480px) {
      .card-actions app-button {
        font-size: 11px;
      }

      .card-badge {
        font-size: 10px;
        padding: 2px 6px;
      }
    }
  `]
})
export class ProjectsKanbanComponent implements OnInit {
  projectService = inject(ProjectService);
  modalService = inject(ModalService);
  private confirmService = inject(ConfirmDialogService);
  private toastService = inject(ToastService);
  private trashService = inject(TrashService);
  draggedProject = signal<Project | null>(null);
  dragOverColumn = signal<string | null>(null);

  ngOnInit() {
    this.projectService.loadProjects();
  }

  getProjectsByStatus(status: string): Project[] {
    return this.projectService.projects$().filter(p => p.status === status);
  }

  onDragStart(project: Project) {
    this.draggedProject.set(project);
  }

  onDragEnd() {
    this.draggedProject.set(null);
  }

  onDragOver(status: string, event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.dragOverColumn.set(status);
  }

  onDragLeave() {
    this.dragOverColumn.set(null);
  }

  onDrop(status: string, event: DragEvent) {
    event.preventDefault();
    const project = this.draggedProject();
    if (project && project.status !== status) {
      this.projectService.updateProject(project.id, {
        ...project,
        status: status as any
      });
    }
    this.dragOverColumn.set(null);
    this.draggedProject.set(null);
  }

  onCreateProject() {
    this.modalService.open({
      component: 'project',
      onConfirm: (projectData) => {
        this.projectService.createProject(projectData);
      }
    });
  }

  onEditProject(project: Project) {
    this.modalService.open({
      component: 'project',
      data: project,
      onConfirm: (updatedData) => {
        this.projectService.updateProject(project.id, updatedData);
      }
    });
  }

  onDeleteProject(projectId: string) {
    const project = this.projectService.projects$().find(p => p.id === projectId);
    this.confirmService.open({
      title: 'Eliminar proyecto',
      message: `\u00BFEst\u00E1s seguro de que deseas eliminar "${project?.name}"? Se mover\u00E1 a la papelera.`,
      icon: '\uD83D\uDDD1\uFE0F',
      confirmText: 'Eliminar',
      onConfirm: () => {
        this.projectService.deleteProject(projectId);
        this.trashService.loadDeletedItems();
        this.toastService.success('Proyecto movido a la papelera');
      }
    });
  }
}
