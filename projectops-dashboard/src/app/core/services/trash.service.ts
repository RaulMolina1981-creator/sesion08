import { Injectable, signal, computed, inject } from '@angular/core';
import { JsonDatabaseService } from './json-database.service';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';
import { TeamService } from './team.service';

export type TrashEntityType = 'project' | 'task' | 'member';

export interface TrashItem {
  id: string;
  name: string;
  type: TrashEntityType;
  deletedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TrashService {
  private jsonDb = inject(JsonDatabaseService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private teamService = inject(TeamService);

  private readonly deletedItemsSource = signal<TrashItem[]>([]);
  private readonly loadingSource = signal(false);

  readonly deletedItems$ = this.deletedItemsSource.asReadonly();
  readonly isLoading$ = this.loadingSource.asReadonly();

  readonly deletedCount = computed(() => this.deletedItemsSource().length);

  readonly deletedProjects = computed(() =>
    this.deletedItemsSource().filter(i => i.type === 'project')
  );
  readonly deletedTasks = computed(() =>
    this.deletedItemsSource().filter(i => i.type === 'task')
  );
  readonly deletedMembers = computed(() =>
    this.deletedItemsSource().filter(i => i.type === 'member')
  );

  loadDeletedItems() {
    this.loadingSource.set(true);

    const projects: TrashItem[] = this.jsonDb.getDeletedProjects().map((p: any) => ({
      id: p.id,
      name: p.name,
      type: 'project' as TrashEntityType,
      deletedAt: new Date(p.deletedAt)
    }));

    const tasks: TrashItem[] = this.jsonDb.getDeletedTasks().map((t: any) => ({
      id: t.id,
      name: t.title,
      type: 'task' as TrashEntityType,
      deletedAt: new Date(t.deletedAt)
    }));

    const members: TrashItem[] = this.jsonDb.getDeletedTeamMembers().map((m: any) => ({
      id: m.id,
      name: m.name,
      type: 'member' as TrashEntityType,
      deletedAt: new Date(m.deletedAt)
    }));

    this.deletedItemsSource.set([...projects, ...tasks, ...members]);
    this.loadingSource.set(false);
  }

  restoreItem(id: string, type: TrashEntityType) {
    switch (type) {
      case 'project':
        this.projectService.restoreProject(id);
        break;
      case 'task':
        this.taskService.restoreTask(id);
        break;
      case 'member':
        this.teamService.restoreMember(id);
        break;
    }
    this.loadDeletedItems();
  }

  permanentDeleteItem(id: string, type: TrashEntityType) {
    switch (type) {
      case 'project':
        this.projectService.permanentDeleteProject(id);
        break;
      case 'task':
        this.taskService.permanentDeleteTask(id);
        break;
      case 'member':
        this.teamService.permanentDeleteMember(id);
        break;
    }
    this.loadDeletedItems();
  }

  emptyTrash() {
    this.jsonDb.emptyTrash();
    this.deletedItemsSource.set([]);
  }
}
