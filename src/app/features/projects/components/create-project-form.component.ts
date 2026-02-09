import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../core/services/modal.service';
import { TeamService } from '../../../core/services/team.service';
import { CreateProjectDTO } from '../../../core/models/project.model';

@Component({
  selector: 'app-create-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editMode ? 'Editar Proyecto' : 'Crear Nuevo Proyecto' }}</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" class="form">
          <div class="form-group">
            <label>Nombre del Proyecto *</label>
            <input
              type="text"
              [(ngModel)]="formData.name"
              name="name"
              required
              placeholder="Ej: Mi Nuevo Proyecto"
            />
          </div>

          <div class="form-group">
            <label>Descripción *</label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              required
              placeholder="Descripción del proyecto"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Manager *</label>
              <select
                [(ngModel)]="formData.manager"
                name="manager"
                required
              >
                <option value="">Selecciona un manager</option>
                <option *ngFor="let member of teamService.activeMembers()" [value]="member.name">
                  {{ member.name }} - {{ getRoleLabel(member.role) }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Equipo *</label>
              <select
                [(ngModel)]="formData.team"
                name="team"
                required
              >
                <option value="">Selecciona un equipo</option>
                <option value="desarrollo">Desarrollo</option>
                <option value="diseno">Diseño</option>
                <option value="qa">QA</option>
                <option value="devops">DevOps</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Tamaño del Equipo *</label>
            <input
              type="number"
              [(ngModel)]="formData.teamSize"
              name="teamSize"
              required
              min="1"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Presupuesto *</label>
              <input
                type="number"
                [(ngModel)]="formData.budget"
                name="budget"
                required
                min="0"
              />
            </div>

            <div class="form-group">
              <label>Gasto Inicial</label>
              <input
                type="number"
                [(ngModel)]="formData.spent"
                name="spent"
                min="0"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Fecha de Inicio *</label>
              <input
                type="date"
                [(ngModel)]="formData.startDate"
                name="startDate"
                required
              />
            </div>

            <div class="form-group">
              <label>Fecha de Fin *</label>
              <input
                type="date"
                [(ngModel)]="formData.endDate"
                name="endDate"
                required
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ editMode ? 'Guardar Cambios' : 'Crear Proyecto' }}
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
export class CreateProjectFormComponent implements OnInit {
  private modalService = inject(ModalService);
  teamService = inject(TeamService);

  editMode = false;
  projectId: string | null = null;

  formData: any = {
    name: '',
    description: '',
    manager: '',
    team: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: 0,
    teamSize: 1,
    spent: 0
  };

  ngOnInit() {
    // Load team members for the select options
    this.teamService.loadTeamMembers();

    const modalData = this.modalService.config$()?.data;
    if (modalData) {
      this.editMode = true;
      this.projectId = modalData.id;
      this.formData = {
        name: modalData.name,
        description: modalData.description,
        manager: modalData.manager,
        team: modalData.team || '',
        startDate: new Date(modalData.startDate).toISOString().split('T')[0],
        endDate: new Date(modalData.endDate).toISOString().split('T')[0],
        budget: modalData.budget,
        teamSize: modalData.teamSize,
        spent: modalData.spent || 0
      };
    }
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'developer': 'Desarrollador',
      'designer': 'Diseñador',
      'manager': 'Gestor',
      'qa': 'QA',
      'devops': 'DevOps'
    };
    return labels[role] || role;
  }

  onSubmit() {
    if (this.formData.name && this.formData.description && this.formData.manager && this.formData.team) {
      if (this.editMode && this.projectId) {
        // Update existing project
        this.modalService.confirm({
          id: this.projectId,
          name: this.formData.name,
          description: this.formData.description,
          manager: this.formData.manager,
          team: this.formData.team,
          budget: this.formData.budget,
          teamSize: this.formData.teamSize || 1,
          spent: this.formData.spent || 0,
          startDate: new Date(this.formData.startDate),
          endDate: new Date(this.formData.endDate)
        });
      } else {
        // Create new project
        const dto: CreateProjectDTO = {
          name: this.formData.name,
          description: this.formData.description,
          manager: this.formData.manager,
          team: this.formData.team,
          budget: this.formData.budget,
          teamSize: this.formData.teamSize || 1,
          spent: this.formData.spent || 0,
          startDate: new Date(this.formData.startDate),
          endDate: new Date(this.formData.endDate)
        };
        this.modalService.confirm(dto);
      }
    }
  }

  onCancel() {
    this.modalService.cancel();
  }
}
