import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../core/services/modal.service';
import { CreateProjectFormComponent } from '../../features/projects/components/create-project-form.component';
import { CreateTaskFormComponent } from '../../features/tasks/components/create-task-form.component';
import { CreateTeamMemberFormComponent } from '../../features/team/components/create-team-member-form.component';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [
    CommonModule,
    CreateProjectFormComponent,
    CreateTaskFormComponent,
    CreateTeamMemberFormComponent
  ],
  template: `
    <div *ngIf="modalService.isOpen$()" class="modal-portal">
      <app-create-project-form
        *ngIf="modalService.config$()?.component === 'project'"
      ></app-create-project-form>

      <app-create-task-form
        *ngIf="modalService.config$()?.component === 'task'"
      ></app-create-task-form>

      <app-create-team-member-form
        *ngIf="modalService.config$()?.component === 'member'"
      ></app-create-team-member-form>
    </div>
  `,
  styles: [`
    .modal-portal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
    }
  `]
})
export class ModalContainerComponent {
  modalService = inject(ModalService);
}
