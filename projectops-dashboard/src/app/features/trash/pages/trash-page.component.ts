import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrashService, TrashItem } from '../../../core/services/trash.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingSpinnerComponent, EmptyStateComponent, ButtonComponent } from '../../../shared/ui';

@Component({
  selector: 'app-trash-page',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent, ButtonComponent],
  template: `
    <div class="trash-container">
      <div class="trash-header">
        <div class="header-content">
          <h2>Papelera</h2>
          <p class="subtitle">{{ trashService.deletedCount() }} elementos eliminados</p>
        </div>
        <div class="header-actions">
          <app-button
            variant="danger"
            size="md"
            [disabled]="trashService.deletedCount() === 0"
            (clicked)="onEmptyTrash()"
          >
            Vaciar Papelera
          </app-button>
        </div>
      </div>

      <app-loading-spinner
        *ngIf="trashService.isLoading$()"
        message="Cargando elementos eliminados..."
      ></app-loading-spinner>

      <app-empty-state
        *ngIf="!trashService.isLoading$() && trashService.deletedCount() === 0"
        icon="\uD83D\uDDD1\uFE0F"
        title="La papelera est\u00E1 vac\u00EDa"
        message="Los elementos eliminados aparecer\u00E1n aqu\u00ED."
      ></app-empty-state>

      <div class="trash-content" *ngIf="!trashService.isLoading$() && trashService.deletedCount() > 0">

        <!-- Proyectos eliminados -->
        <div class="trash-section" *ngIf="trashService.deletedProjects().length > 0">
          <h3 class="section-title">Proyectos ({{ trashService.deletedProjects().length }})</h3>
          <div class="trash-list">
            <div *ngFor="let item of trashService.deletedProjects()" class="trash-item">
              <div class="trash-item-icon">\uD83D\uDCCA</div>
              <div class="trash-item-info">
                <span class="trash-item-name">{{ item.name }}</span>
                <span class="trash-item-date">Eliminado: {{ item.deletedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="trash-item-actions">
                <app-button variant="success" size="sm" (clicked)="onRestore(item)">Restaurar</app-button>
                <app-button variant="danger" size="sm" (clicked)="onPermanentDelete(item)">Eliminar</app-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tareas eliminadas -->
        <div class="trash-section" *ngIf="trashService.deletedTasks().length > 0">
          <h3 class="section-title">Tareas ({{ trashService.deletedTasks().length }})</h3>
          <div class="trash-list">
            <div *ngFor="let item of trashService.deletedTasks()" class="trash-item">
              <div class="trash-item-icon">\u2713</div>
              <div class="trash-item-info">
                <span class="trash-item-name">{{ item.name }}</span>
                <span class="trash-item-date">Eliminado: {{ item.deletedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="trash-item-actions">
                <app-button variant="success" size="sm" (clicked)="onRestore(item)">Restaurar</app-button>
                <app-button variant="danger" size="sm" (clicked)="onPermanentDelete(item)">Eliminar</app-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Miembros eliminados -->
        <div class="trash-section" *ngIf="trashService.deletedMembers().length > 0">
          <h3 class="section-title">Miembros del Equipo ({{ trashService.deletedMembers().length }})</h3>
          <div class="trash-list">
            <div *ngFor="let item of trashService.deletedMembers()" class="trash-item">
              <div class="trash-item-icon">\uD83D\uDC65</div>
              <div class="trash-item-info">
                <span class="trash-item-name">{{ item.name }}</span>
                <span class="trash-item-date">Eliminado: {{ item.deletedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="trash-item-actions">
                <app-button variant="success" size="sm" (clicked)="onRestore(item)">Restaurar</app-button>
                <app-button variant="danger" size="sm" (clicked)="onPermanentDelete(item)">Eliminar</app-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .trash-container {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
      animation: slideInUp var(--transition-base);
    }

    .trash-header {
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

    .trash-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .trash-section {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      padding: 16px 20px;
      background-color: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .trash-list {
      display: flex;
      flex-direction: column;
    }

    .trash-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);
      transition: background-color var(--transition-fast);
    }

    .trash-item:last-child {
      border-bottom: none;
    }

    .trash-item:hover {
      background-color: var(--bg-hover);
    }

    .trash-item-icon {
      font-size: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-secondary);
      border-radius: var(--radius-md);
      flex-shrink: 0;
    }

    .trash-item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .trash-item-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .trash-item-date {
      font-size: 12px;
      color: var(--text-muted);
    }

    .trash-item-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    @keyframes slideInUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 768px) {
      .trash-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .trash-item {
        flex-wrap: wrap;
        gap: 12px;
      }

      .trash-item-actions {
        width: 100%;
      }

      .trash-item-actions app-button {
        flex: 1;
      }
    }
  `]
})
export class TrashPageComponent implements OnInit {
  trashService = inject(TrashService);
  private confirmService = inject(ConfirmDialogService);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.trashService.loadDeletedItems();
  }

  onRestore(item: TrashItem) {
    this.confirmService.open({
      title: 'Restaurar elemento',
      message: `\u00BFDeseas restaurar "${item.name}"?`,
      icon: '\u267B\uFE0F',
      confirmText: 'Restaurar',
      confirmVariant: 'success',
      onConfirm: () => {
        this.trashService.restoreItem(item.id, item.type);
        this.toastService.success(`"${item.name}" restaurado correctamente`);
      }
    });
  }

  onPermanentDelete(item: TrashItem) {
    this.confirmService.open({
      title: 'Eliminar permanentemente',
      message: `\u00BFEst\u00E1s seguro? "${item.name}" se eliminar\u00E1 de forma permanente y no se podr\u00E1 recuperar.`,
      icon: '\u26A0\uFE0F',
      confirmText: 'Eliminar permanentemente',
      onConfirm: () => {
        this.trashService.permanentDeleteItem(item.id, item.type);
        this.toastService.success(`"${item.name}" eliminado permanentemente`);
      }
    });
  }

  onEmptyTrash() {
    this.confirmService.open({
      title: 'Vaciar papelera',
      message: '\u00BFEst\u00E1s seguro? Todos los elementos se eliminar\u00E1n de forma permanente.',
      icon: '\uD83D\uDDD1\uFE0F',
      confirmText: 'Vaciar papelera',
      onConfirm: () => {
        this.trashService.emptyTrash();
        this.toastService.success('Papelera vaciada correctamente');
      }
    });
  }
}
