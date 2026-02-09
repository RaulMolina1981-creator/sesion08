import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../core/services/modal.service';
import { ProjectService } from '../../../core/services/project.service';
import { TeamService } from '../../../core/services/team.service';
import { CreateTaskDTO } from '../../../core/models/task.model';

@Component({
  selector: 'app-create-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editMode ? 'Editar Tarea' : 'Crear Nueva Tarea' }}</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" class="form">
          <div class="form-group">
            <label>Título *</label>
            <input
              type="text"
              [(ngModel)]="formData.title"
              name="title"
              required
              placeholder="Ej: Implementar feature X"
            />
          </div>

          <div class="form-group">
            <label>Descripción *</label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              required
              placeholder="Descripción detallada de la tarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Proyecto *</label>
              <select [(ngModel)]="formData.projectId" name="projectId" required>
                <option value="" disabled>Selecciona un proyecto</option>
                <option *ngFor="let project of projectService.projects$()" [value]="project.id">
                  {{ project.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Asignado a *</label>
              <select [(ngModel)]="formData.assignedTo" name="assignedTo" required>
                <option value="" disabled>Selecciona un miembro</option>
                <option *ngFor="let member of teamService.members$()" [value]="member.name">
                  {{ member.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prioridad *</label>
              <select [(ngModel)]="formData.priority" name="priority" required>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div class="form-group">
              <label>Estado *</label>
              <select [(ngModel)]="formData.status" name="status" required>
                <option value="pending">Pendiente</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Horas Estimadas *</label>
              <input
                type="number"
                [(ngModel)]="formData.estimatedHours"
                name="estimatedHours"
                required
                min="1"
              />
            </div>

            <div class="form-group">
              <label>Horas Gastadas</label>
              <input
                type="number"
                [(ngModel)]="formData.spentHours"
                name="spentHours"
                min="0"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Fecha de Vencimiento *</label>
            <input
              type="date"
              [(ngModel)]="formData.dueDate"
              name="dueDate"
              required
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ editMode ? 'Guardar Cambios' : 'Crear Tarea' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .close-btn:hover {
      background-color: #f3f4f6;
    }

    .form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-weight: 500;
      font-size: 14px;
      color: #374151;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary,
    .btn-secondary {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1d4ed8;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background-color: #d1d5db;
    }
  `]
})
export class CreateTaskFormComponent implements OnInit {
  private modalService = inject(ModalService);
  projectService = inject(ProjectService);
  teamService = inject(TeamService);

  editMode = false;
  taskId: string | null = null;

  formData: any = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 8,
    spentHours: 0,
    projectId: '',
    assignedTo: ''
  };

  ngOnInit() {
    // Cargar proyectos y miembros del equipo
    this.projectService.loadProjects();
    this.teamService.loadTeamMembers();

    // Verificar si hay datos para edición
    const modalData = this.modalService.config$()?.data;
    if (modalData) {
      this.editMode = true;
      this.taskId = modalData.id;
      this.formData = {
        title: modalData.title,
        description: modalData.description,
        priority: modalData.priority,
        status: modalData.status,
        dueDate: new Date(modalData.dueDate).toISOString().split('T')[0],
        estimatedHours: modalData.estimatedHours,
        spentHours: modalData.spentHours || 0,
        projectId: modalData.projectId,
        assignedTo: modalData.assignedTo
      };
    }
  }

  onSubmit() {
    if (this.formData.title && this.formData.description && this.formData.projectId && this.formData.assignedTo) {
      if (this.editMode && this.taskId) {
        // Update existing task
        this.modalService.confirm({
          id: this.taskId,
          title: this.formData.title,
          description: this.formData.description,
          priority: this.formData.priority,
          status: this.formData.status,
          dueDate: new Date(this.formData.dueDate),
          estimatedHours: this.formData.estimatedHours,
          spentHours: this.formData.spentHours || 0,
          projectId: this.formData.projectId,
          assignedTo: this.formData.assignedTo
        });
      } else {
        // Create new task
        const dto: CreateTaskDTO = {
          title: this.formData.title,
          description: this.formData.description,
          priority: this.formData.priority,
          status: this.formData.status || 'pending',
          dueDate: new Date(this.formData.dueDate),
          estimatedHours: this.formData.estimatedHours,
          spentHours: this.formData.spentHours || 0,
          projectId: this.formData.projectId,
          assignedTo: this.formData.assignedTo
        };
        this.modalService.confirm(dto);
      }
    }
  }

  onCancel() {
    this.modalService.cancel();
  }
}
