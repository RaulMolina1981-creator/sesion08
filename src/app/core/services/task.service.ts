import { Injectable, signal, computed } from '@angular/core';
import { JsonDatabaseService } from './json-database.service';
import { Task, CreateTaskDTO, UpdateTaskDTO, PriorityType } from '../models/task.model';

interface TaskFilters {
  projectId?: string;
  assignedTo?: string;
  status?: string;
  priority?: PriorityType;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasksSource = signal<Task[]>([]);
  private readonly filtersSource = signal<TaskFilters>({});
  private readonly loadingSource = signal(false);

  readonly tasks$ = this.tasksSource.asReadonly();
  readonly filters$ = this.filtersSource.asReadonly();
  readonly isLoading$ = this.loadingSource.asReadonly();

  readonly filteredTasks = computed(() => {
    const tasks = this.tasksSource();
    const filters = this.filtersSource();

    return tasks.filter(task => {
      if (filters.projectId && task.projectId !== filters.projectId) return false;
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      return true;
    });
  });

  readonly taskCount = computed(() => this.tasksSource().length);
  readonly overdueTasks = computed(() =>
    this.tasksSource().filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed')
  );

  constructor(private jsonDb: JsonDatabaseService) {}

  loadTasks() {
    this.loadingSource.set(true);
    const tasks = this.jsonDb.getTasks();
    this.tasksSource.set(tasks);
    this.loadingSource.set(false);

    // En producción, descomenta esto:
    // this.apiService.get<Task[]>('/tasks').subscribe({
    //   next: (tasks) => {
    //     this.tasksSource.set(tasks);
    //     this.loadingSource.set(false);
    //   },
    //   error: (err) => {
    //     console.error('Error loading tasks:', err);
    //     this.loadingSource.set(false);
    //   }
    // });
  }

  getTaskById(id: string) {
    this.loadingSource.set(true);
    const task = this.jsonDb.getTaskById(id);
    if (task) {
      const tasks = this.tasksSource();
      const index = tasks.findIndex(t => t.id === id);
      if (index > -1) {
        tasks[index] = task;
        this.tasksSource.set([...tasks]);
      } else {
        this.tasksSource.set([...tasks, task]);
      }
    }
    this.loadingSource.set(false);
  }

  createTask(task: CreateTaskDTO) {
    this.loadingSource.set(true);
    const newTask = this.jsonDb.createTask(task);
    this.tasksSource.set([...this.tasksSource(), newTask]);
    this.loadingSource.set(false);
  }

  updateTask(id: string, updates: UpdateTaskDTO) {
    this.loadingSource.set(true);
    const updatedTask = this.jsonDb.updateTask(id, updates);
    if (updatedTask) {
      const tasks = this.tasksSource();
      const index = tasks.findIndex(t => t.id === id);
      if (index > -1) {
        tasks[index] = updatedTask;
        this.tasksSource.set([...tasks]);
      }
    }
    this.loadingSource.set(false);
  }

  deleteTask(id: string) {
    this.loadingSource.set(true);
    this.jsonDb.deleteTask(id);
    this.tasksSource.set(
      this.tasksSource().filter(t => t.id !== id)
    );
    this.loadingSource.set(false);
  }

  setFilters(filters: TaskFilters) {
    this.filtersSource.set(filters);
  }

  clearFilters() {
    this.filtersSource.set({});
  }
}
