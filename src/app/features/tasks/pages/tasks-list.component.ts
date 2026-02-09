import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { ModalService } from '../../../core/services/modal.service';
import { LoadingSpinnerComponent, EmptyStateComponent, ButtonComponent } from '../../../shared/ui';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent, ButtonComponent],
  template: `
    <div class="tasks-container">
      <div class="tasks-header">
        <div class="header-content">
          <h2>Tareas</h2>
          <p class="subtitle">{{ taskService.tasks$().length }} de {{ taskService.tasks$().length }} tareas</p>
        </div>
        <app-button variant="primary" size="md" (clicked)="onCreateTask()">
          + Nueva Tarea
        </app-button>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Estado</label>
          <select (change)="onStatusFilterChange($event)" class="filter-select">
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Prioridad</label>
          <select (change)="onPriorityFilterChange($event)" class="filter-select">
            <option value="">Todas</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Ordenar por</label>
          <select (change)="onSortChange($event)" class="filter-select">
            <option value="date-desc">Más recientes</option>
            <option value="date-asc">Más antiguas</option>
            <option value="priority">Prioridad</option>
            <option value="dueDate">Fecha de vencimiento</option>
          </select>
        </div>
      </div>

      <app-loading-spinner
        *ngIf="taskService.isLoading$()"
        message="Cargando tareas..."
      ></app-loading-spinner>

      <app-empty-state
        *ngIf="!taskService.isLoading$() && taskService.tasks$().length === 0"
        icon="✓"
        title="Sin tareas"
        message="¡Todo en orden! Crea una nueva tarea para comenzar."
        actionLabel="Crear Tarea"
      ></app-empty-state>

      <div class="tasks-list" *ngIf="!taskService.isLoading$() && filteredTasks().length > 0">
        <div *ngFor="let task of filteredTasks()" class="task-item" [class.high-priority]="task.priority === 'high'">
          <div class="task-priority-indicator"></div>
          <div class="task-content">
            <h4>{{ task.title }}</h4>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-meta">
              <span class="task-meta-item">{{ task.dueDate | date: 'dd/MM/yyyy' }}</span>
              <span class="task-meta-item">{{ task.estimatedHours }}h estimadas</span>
            </div>
          </div>
          <div class="task-right">
            <span class="task-priority-badge" [class]="'priority-' + task.priority">
              {{ getPriorityLabel(task.priority) }}
            </span>
            <span class="task-status-badge" [class]="'status-' + task.status">
              {{ getStatusLabel(task.status) }}
            </span>
            <div class="task-actions">
              <app-button variant="secondary" size="sm" (clicked)="onEditTask(task)">
                Editar
              </app-button>
              <app-button variant="danger" size="sm" (clicked)="onDeleteTask(task.id)">
                Eliminar
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      padding: 24px;
    }

    .tasks-header {
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


    .filters-section {
      margin-bottom: 24px;
      display: flex;
      gap: 16px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-group label {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 13px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      cursor: pointer;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .task-item {
      display: grid;
      grid-template-columns: 4px 1fr auto;
      gap: 16px;
      padding: 16px;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      align-items: center;
      transition: box-shadow var(--transition-fast);
    }

    .task-item:hover {
      box-shadow: var(--shadow-md);
    }

    .task-item.high-priority {
      border-left: 4px solid var(--error-color);
    }

    .task-priority-indicator {
      width: 4px;
      height: 100%;
      background-color: var(--warning-color);
      border-radius: 2px;
    }

    .task-content {
      flex: 1;
    }

    .task-content h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: var(--text-primary);
    }

    .task-description {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 0 0 8px 0;
    }

    .task-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--text-muted);
    }

    .task-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .task-priority-badge,
    .task-status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }

    .priority-high {
      background-color: var(--error-light);
      color: var(--error-color);
    }

    .priority-medium {
      background-color: var(--warning-light);
      color: var(--warning-color);
    }

    .priority-low {
      background-color: var(--success-light);
      color: var(--success-color);
    }

    .status-pending {
      background-color: var(--warning-light);
      color: var(--warning-color);
    }

    .status-in-progress {
      background-color: var(--info-light);
      color: var(--info-color);
    }

    .status-completed {
      background-color: var(--success-light);
      color: var(--success-color);
    }

    .status-cancelled {
      background-color: var(--error-light);
      color: var(--error-color);
    }

    /* Dark mode adjustments */
    html[data-theme="dark"] .priority-high {
      background-color: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    html[data-theme="dark"] .priority-medium {
      background-color: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }

    html[data-theme="dark"] .priority-low {
      background-color: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }

    html[data-theme="dark"] .status-pending {
      background-color: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }

    html[data-theme="dark"] .status-in-progress {
      background-color: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }

    html[data-theme="dark"] .status-completed {
      background-color: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }

    html[data-theme="dark"] .status-cancelled {
      background-color: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    .task-actions {
      display: flex;
      gap: 8px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .tasks-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        width: 100%;
      }

      .filter-select {
        width: 100%;
      }

      .task-item {
        grid-template-columns: 4px 1fr;
        gap: 12px;
      }

      .task-right {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        gap: 8px;
        margin-top: 8px;
      }

      .task-actions {
        width: 100%;
      }

      .task-actions app-button {
        flex: 1;
      }
    }

    @media (max-width: 480px) {
      .tasks-header app-button {
        width: 100%;
      }

      .task-priority-badge,
      .task-status-badge {
        font-size: 11px;
        padding: 3px 10px;
      }
    }
  `]
})
export class TasksListComponent implements OnInit {
  taskService = inject(TaskService);
  modalService = inject(ModalService);
  selectedStatus = '';
  selectedPriority = '';
  sortBy = 'date-desc';

  ngOnInit() {
    this.taskService.loadTasks();
  }

  onCreateTask() {
    this.modalService.open({
      component: 'task',
      onConfirm: (taskData) => {
        this.taskService.createTask(taskData);
      }
    });
  }

  filteredTasks() {
    let tasks = [...this.taskService.tasks$()];

    // Aplicar filtro de estado
    if (this.selectedStatus) {
      tasks = tasks.filter(task => task.status === this.selectedStatus);
    }

    // Aplicar filtro de prioridad
    if (this.selectedPriority) {
      tasks = tasks.filter(task => task.priority === this.selectedPriority);
    }

    // Aplicar ordenamiento
    tasks = this.sortTasks(tasks);

    return tasks;
  }

  sortTasks(tasks: any[]) {
    const priorityOrder: Record<string, number> = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };

    switch (this.sortBy) {
      case 'date-desc':
        return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'date-asc':
        return tasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'priority':
        return tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'dueDate':
        return tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      default:
        return tasks;
    }
  }

  onStatusFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
  }

  onPriorityFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedPriority = target.value;
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'critical': 'Crítica',
      'high': 'Alta',
      'medium': 'Media',
      'low': 'Baja'
    };
    return labels[priority] || priority;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'Pendiente',
      'in-progress': 'En Progreso',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  onEditTask(task: any) {
    this.modalService.open({
      component: 'task',
      data: task,
      onConfirm: (updatedData) => {
        this.taskService.updateTask(task.id, updatedData);
      }
    });
  }

  onDeleteTask(taskId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId);
      alert('Tarea eliminada correctamente');
    }
  }
}
