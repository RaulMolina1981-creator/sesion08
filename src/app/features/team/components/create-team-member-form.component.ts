import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../core/services/modal.service';
import { CreateTeamMemberDTO } from '../../../core/models/team-member.model';

@Component({
  selector: 'app-create-team-member-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editMode ? 'Editar Miembro' : 'Agregar Miembro del Equipo' }}</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" class="form">
          <div class="form-group">
            <label>Nombre Completo *</label>
            <input
              type="text"
              [(ngModel)]="formData.name"
              name="name"
              required
              placeholder="Ej: Juan García"
            />
          </div>

          <div class="form-group">
            <label>Email *</label>
            <input
              type="email"
              [(ngModel)]="formData.email"
              name="email"
              required
              placeholder="juan@company.com"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Rol *</label>
              <select [(ngModel)]="formData.role" name="role" required>
                <option value="developer">Desarrollador</option>
                <option value="designer">Diseñador</option>
                <option value="manager">Manager</option>
                <option value="qa">QA</option>
                <option value="devops">DevOps</option>
              </select>
            </div>

            <div class="form-group">
              <label>Departamento *</label>
              <input
                type="text"
                [(ngModel)]="formData.department"
                name="department"
                required
                placeholder="Ej: Frontend"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Habilidades (separadas por comas)</label>
            <textarea
              [(ngModel)]="skillsText"
              name="skills"
              placeholder="Angular, TypeScript, CSS"
              rows="2"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ editMode ? 'Guardar Cambios' : 'Crear Miembro' }}
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
export class CreateTeamMemberFormComponent implements OnInit {
  private modalService = inject(ModalService);

  editMode = false;
  memberId: string | null = null;
  skillsText = '';

  formData: CreateTeamMemberDTO = {
    name: '',
    email: '',
    role: 'developer',
    department: '',
    skills: []
  };

  ngOnInit() {
    // Verificar si hay datos para edición
    const modalData = this.modalService.config$()?.data;
    if (modalData) {
      this.editMode = true;
      this.memberId = modalData.id;
      this.formData = {
        name: modalData.name,
        email: modalData.email,
        role: modalData.role,
        department: modalData.department,
        skills: modalData.skills || []
      };
      this.skillsText = modalData.skills ? modalData.skills.join(', ') : '';
    }
  }

  onSubmit() {
    if (this.formData.name && this.formData.email && this.formData.department) {
      this.formData.skills = this.skillsText
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (this.editMode && this.memberId) {
        // Update existing member
        this.modalService.confirm({
          id: this.memberId,
          name: this.formData.name,
          email: this.formData.email,
          role: this.formData.role,
          department: this.formData.department,
          skills: this.formData.skills
        });
      } else {
        // Create new member
        this.modalService.confirm(this.formData);
      }
    }
  }

  onCancel() {
    this.modalService.cancel();
  }
}
