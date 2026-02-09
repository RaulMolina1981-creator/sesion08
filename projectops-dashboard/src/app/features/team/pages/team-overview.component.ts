import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../../core/services/team.service';
import { ModalService } from '../../../core/services/modal.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';
import { TrashService } from '../../../core/services/trash.service';
import { LoadingSpinnerComponent, EmptyStateComponent } from '../../../shared/ui';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="team-container">
      <div class="team-header">
        <div class="header-content">
          <h2>Equipo</h2>
          <p class="subtitle">{{ teamService.activeMembers().length }} miembros del equipo</p>
        </div>
        <button class="btn-primary" (click)="onCreateMember()">+ Nuevo Miembro</button>
      </div>

      <app-loading-spinner
        *ngIf="teamService.isLoading$()"
        message="Cargando miembros del equipo..."
      ></app-loading-spinner>

      <app-empty-state
        *ngIf="!teamService.isLoading$() && teamService.members$().length === 0"
        icon="👥"
        title="Sin miembros del equipo"
        message="Comienza agregando miembros a tu equipo."
        actionLabel="Agregar Miembro"
      ></app-empty-state>

      <div class="team-grid" *ngIf="!teamService.isLoading$() && teamService.activeMembers().length > 0">
        <div *ngFor="let member of teamService.activeMembers()" class="member-card" (click)="onMemberClick(member)">
          <div class="member-avatar" [style.background-color]="getAvatarColor(member.name)">
            {{ member.name.substring(0, 2).toUpperCase() }}
          </div>
          <h3>{{ member.name }}</h3>
          <p class="role">{{ getRoleLabel(member.role) }}</p>
          <div class="member-stats">
            <div class="stat">
              <span class="stat-value">{{ member.projects.length }}</span>
              <span class="stat-label">Proyectos</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ member.skills.length }}</span>
              <span class="stat-label">Habilidades</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Detalle -->
      <div class="modal-overlay" *ngIf="selectedMember" (click)="onCloseModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="onCloseModal()">×</button>
          <div class="modal-header">
            <div class="modal-avatar" [style.background-color]="getAvatarColor(selectedMember.name)">
              {{ selectedMember.name.substring(0, 2).toUpperCase() }}
            </div>
            <div class="modal-header-info">
              <h2>{{ selectedMember.name }}</h2>
              <p class="modal-role">{{ getRoleLabel(selectedMember.role) }}</p>
              <p class="modal-email">{{ selectedMember.email }}</p>
            </div>
          </div>

          <div class="modal-body">
            <div class="info-section">
              <h4>Información</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Rol</label>
                  <span>{{ getRoleLabel(selectedMember.role) }}</span>
                </div>
                <div class="info-item">
                  <label>Departamento</label>
                  <span>{{ selectedMember.department }}</span>
                </div>
                <div class="info-item">
                  <label>Se Unió</label>
                  <span>{{ selectedMember.joinDate | date: 'dd/MM/yyyy' }}</span>
                </div>
                <div class="info-item">
                  <label>Estado</label>
                  <span class="badge" [class.active]="selectedMember.active" [class.inactive]="!selectedMember.active">
                    {{ selectedMember.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h4>Proyectos Asignados</h4>
              <div class="projects-list">
                <span *ngFor="let projectId of selectedMember.projects" class="project-tag">
                  Proyecto {{ projectId }}
                </span>
              </div>
            </div>

            <div class="info-section">
              <h4>Habilidades</h4>
              <div class="skills-list">
                <span *ngFor="let skill of selectedMember.skills" class="skill-tag">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-danger" (click)="onDeleteMember(selectedMember.id)">Eliminar</button>
            <button class="btn-secondary" (click)="onCloseModal()">Cerrar</button>
            <button class="btn-primary" (click)="onEditMember(selectedMember)">Editar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .team-container {
      padding: 24px;
    }

    .team-header {
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
      transition: background-color var(--transition-fast);
    }

    .btn-primary:hover {
      background-color: var(--accent-hover);
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }

    .member-card {
      padding: 20px;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      transition: box-shadow var(--transition-fast), transform var(--transition-fast);
    }

    .member-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .member-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      margin: 0 auto 16px;
    }

    .member-card h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .role {
      margin: 0 0 16px 0;
      color: var(--text-secondary);
      font-size: 12px;
      text-transform: uppercase;
    }

    .member-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: var(--accent-color);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* Modal Styles */
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
    }

    .modal-content {
      background-color: var(--bg-primary);
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: var(--shadow-lg);
    }

    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: var(--text-secondary);
      z-index: 1001;
    }

    .modal-header {
      padding: 24px 24px 0 24px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .modal-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .modal-header-info h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    .modal-role {
      font-size: 12px;
      color: var(--text-secondary);
      margin: 0 0 4px 0;
      text-transform: uppercase;
    }

    .modal-email {
      font-size: 13px;
      color: var(--text-muted);
      margin: 0;
    }

    .modal-body {
      padding: 24px;
    }

    .info-section {
      margin-bottom: 24px;
    }

    .info-section h4 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 12px 0;
      text-transform: uppercase;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item label {
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .info-item span {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge.active {
      background-color: var(--success-light);
      color: var(--success-color);
    }

    .badge.inactive {
      background-color: var(--warning-light);
      color: var(--warning-color);
    }

    /* Dark mode adjustments for badges */
    html[data-theme="dark"] .badge.active {
      background-color: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }

    html[data-theme="dark"] .badge.inactive {
      background-color: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }

    .projects-list,
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .project-tag,
    .skill-tag {
      display: inline-block;
      padding: 6px 12px;
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .skill-tag {
      background-color: var(--info-light);
      color: var(--info-color);
    }

    /* Dark mode adjustments for skill tags */
    html[data-theme="dark"] .skill-tag {
      background-color: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-secondary {
      padding: 8px 16px;
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .btn-secondary:hover {
      background-color: var(--bg-hover);
    }

    .btn-danger {
      padding: 8px 16px;
      background-color: var(--error-light);
      color: var(--error-color);
      border: 1px solid var(--error-light);
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-danger:hover {
      background-color: rgba(239, 68, 68, 0.3);
      border-color: var(--error-color);
    }

    /* Dark mode adjustments for danger button */
    html[data-theme="dark"] .btn-danger {
      background-color: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border-color: rgba(239, 68, 68, 0.5);
    }

    html[data-theme="dark"] .btn-danger:hover {
      background-color: rgba(239, 68, 68, 0.3);
      border-color: #f87171;
    }
  `]
})
export class TeamOverviewComponent implements OnInit {
  teamService = inject(TeamService);
  modalService = inject(ModalService);
  private confirmService = inject(ConfirmDialogService);
  private toastService = inject(ToastService);
  private trashService = inject(TrashService);
  selectedMember: any = null;

  ngOnInit() {
    this.teamService.loadTeamMembers();
  }

  onCreateMember() {
    this.modalService.open({
      component: 'member',
      onConfirm: (memberData) => {
        this.teamService.createMember(memberData);
      }
    });
  }

  onMemberClick(member: any) {
    this.selectedMember = member;
  }

  onCloseModal() {
    this.selectedMember = null;
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'developer': 'Desarrollador',
      'designer': 'Diseñador',
      'manager': 'Gestor de Proyectos',
      'qa': 'Aseguramiento de Calidad',
      'devops': 'DevOps'
    };
    return labels[role] || role;
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#6366f1',
      '#3b82f6',
      '#1d4ed8',
      '#0891b2',
      '#059669',
      '#d97706',
      '#dc2626',
      '#9333ea'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  onEditMember(member: any) {
    this.modalService.open({
      component: 'member',
      data: member,
      onConfirm: (updatedData) => {
        this.teamService.updateMember(member.id, updatedData);
        this.onCloseModal();
      }
    });
  }

  onDeleteMember(memberId: string) {
    const member = this.teamService.members$().find(m => m.id === memberId);
    this.confirmService.open({
      title: 'Eliminar miembro',
      message: `\u00BFEst\u00E1s seguro de que deseas eliminar a "${member?.name}"? Se mover\u00E1 a la papelera.`,
      icon: '\uD83D\uDDD1\uFE0F',
      confirmText: 'Eliminar',
      onConfirm: () => {
        this.teamService.removeMember(memberId);
        this.onCloseModal();
        this.trashService.loadDeletedItems();
        this.toastService.success('Miembro movido a la papelera');
      }
    });
  }
}
