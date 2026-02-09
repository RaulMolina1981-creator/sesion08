import { Injectable } from '@angular/core';

export interface Database {
  projects: any[];
  tasks: any[];
  teamMembers: any[];
}

@Injectable({
  providedIn: 'root'
})
export class JsonDatabaseService {
  private db: Database;
  private readonly STORAGE_KEY = 'projectops_db';

  constructor() {
    // Cargar datos de localStorage o inicializar con datos por defecto
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.db = JSON.parse(stored);
      this.migrateData();
    } else {
      this.db = {
        projects: [],
        tasks: [],
        teamMembers: []
      };
    }
  }

  // ==================== DATA MIGRATION ====================
  private migrateData(): void {
    let needsSave = false;

    for (const project of this.db.projects) {
      if (project.isDeleted === undefined) {
        project.isDeleted = false;
        project.deletedAt = null;
        needsSave = true;
      }
    }
    for (const task of this.db.tasks) {
      if (task.isDeleted === undefined) {
        task.isDeleted = false;
        task.deletedAt = null;
        needsSave = true;
      }
    }
    for (const member of this.db.teamMembers) {
      if (member.isDeleted === undefined) {
        member.isDeleted = false;
        member.deletedAt = null;
        needsSave = true;
      }
    }

    if (needsSave) {
      this.save();
    }
  }

  // ==================== PROJECTS ====================
  getProjects(): any[] {
    return this.db.projects.filter(p => !p.isDeleted);
  }

  getProjectById(id: string): any {
    return this.db.projects.find(p => p.id === id && !p.isDeleted);
  }

  createProject(project: any): any {
    const newProject = {
      ...project,
      id: this.generateId('project'),
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      teamSize: project.teamSize || 1,
      spent: project.spent || 0,
      isDeleted: false,
      deletedAt: null
    };
    this.db.projects.push(newProject);
    this.save();
    return newProject;
  }

  updateProject(id: string, updates: any): any {
    const index = this.db.projects.findIndex(p => p.id === id);
    if (index > -1) {
      this.db.projects[index] = { ...this.db.projects[index], ...updates, id };
      this.save();
      return this.db.projects[index];
    }
    return null;
  }

  deleteProject(id: string): boolean {
    const index = this.db.projects.findIndex(p => p.id === id);
    if (index > -1) {
      this.db.projects[index] = {
        ...this.db.projects[index],
        isDeleted: true,
        deletedAt: new Date()
      };
      this.save();
      return true;
    }
    return false;
  }

  getDeletedProjects(): any[] {
    return this.db.projects.filter(p => p.isDeleted);
  }

  restoreProject(id: string): boolean {
    const index = this.db.projects.findIndex(p => p.id === id && p.isDeleted);
    if (index > -1) {
      this.db.projects[index] = {
        ...this.db.projects[index],
        isDeleted: false,
        deletedAt: null
      };
      this.save();
      return true;
    }
    return false;
  }

  permanentDeleteProject(id: string): boolean {
    const index = this.db.projects.findIndex(p => p.id === id);
    if (index > -1) {
      this.db.projects.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // ==================== TASKS ====================
  getTasks(): any[] {
    return this.db.tasks.filter(t => !t.isDeleted);
  }

  getTaskById(id: string): any {
    return this.db.tasks.find(t => t.id === id && !t.isDeleted);
  }

  createTask(task: any): any {
    const newTask = {
      ...task,
      id: this.generateId('task'),
      status: task.status || 'pending',
      spentHours: task.spentHours || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      deletedAt: null
    };
    this.db.tasks.push(newTask);
    this.save();
    return newTask;
  }

  updateTask(id: string, updates: any): any {
    const index = this.db.tasks.findIndex(t => t.id === id);
    if (index > -1) {
      this.db.tasks[index] = { ...this.db.tasks[index], ...updates, id };
      this.save();
      return this.db.tasks[index];
    }
    return null;
  }

  deleteTask(id: string): boolean {
    const index = this.db.tasks.findIndex(t => t.id === id);
    if (index > -1) {
      this.db.tasks[index] = {
        ...this.db.tasks[index],
        isDeleted: true,
        deletedAt: new Date()
      };
      this.save();
      return true;
    }
    return false;
  }

  getDeletedTasks(): any[] {
    return this.db.tasks.filter(t => t.isDeleted);
  }

  restoreTask(id: string): boolean {
    const index = this.db.tasks.findIndex(t => t.id === id && t.isDeleted);
    if (index > -1) {
      this.db.tasks[index] = {
        ...this.db.tasks[index],
        isDeleted: false,
        deletedAt: null
      };
      this.save();
      return true;
    }
    return false;
  }

  permanentDeleteTask(id: string): boolean {
    const index = this.db.tasks.findIndex(t => t.id === id);
    if (index > -1) {
      this.db.tasks.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // ==================== TEAM MEMBERS ====================
  getTeamMembers(): any[] {
    return this.db.teamMembers.filter(m => !m.isDeleted);
  }

  getTeamMemberById(id: string): any {
    return this.db.teamMembers.find(m => m.id === id && !m.isDeleted);
  }

  createTeamMember(member: any): any {
    const newMember = {
      ...member,
      id: this.generateId('member'),
      active: true,
      joinDate: new Date(),
      projects: [],
      createdAt: new Date(),
      isDeleted: false,
      deletedAt: null
    };
    this.db.teamMembers.push(newMember);
    this.save();
    return newMember;
  }

  updateTeamMember(id: string, updates: any): any {
    const index = this.db.teamMembers.findIndex(m => m.id === id);
    if (index > -1) {
      this.db.teamMembers[index] = { ...this.db.teamMembers[index], ...updates, id };
      this.save();
      return this.db.teamMembers[index];
    }
    return null;
  }

  deleteTeamMember(id: string): boolean {
    const index = this.db.teamMembers.findIndex(m => m.id === id);
    if (index > -1) {
      this.db.teamMembers[index] = {
        ...this.db.teamMembers[index],
        isDeleted: true,
        deletedAt: new Date()
      };
      this.save();
      return true;
    }
    return false;
  }

  getDeletedTeamMembers(): any[] {
    return this.db.teamMembers.filter(m => m.isDeleted);
  }

  restoreTeamMember(id: string): boolean {
    const index = this.db.teamMembers.findIndex(m => m.id === id && m.isDeleted);
    if (index > -1) {
      this.db.teamMembers[index] = {
        ...this.db.teamMembers[index],
        isDeleted: false,
        deletedAt: null
      };
      this.save();
      return true;
    }
    return false;
  }

  permanentDeleteTeamMember(id: string): boolean {
    const index = this.db.teamMembers.findIndex(m => m.id === id);
    if (index > -1) {
      this.db.teamMembers.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // ==================== TRASH MANAGEMENT ====================
  emptyTrash(): void {
    this.db.projects = this.db.projects.filter(p => !p.isDeleted);
    this.db.tasks = this.db.tasks.filter(t => !t.isDeleted);
    this.db.teamMembers = this.db.teamMembers.filter(m => !m.isDeleted);
    this.save();
  }

  getDeletedCount(): number {
    return this.getDeletedProjects().length +
      this.getDeletedTasks().length +
      this.getDeletedTeamMembers().length;
  }

  // ==================== DATABASE MANAGEMENT ====================
  loadFromJson(jsonData: Database): void {
    this.db = JSON.parse(JSON.stringify(jsonData));
    this.migrateData();
    this.save();
  }

  getDatabase(): Database {
    return JSON.parse(JSON.stringify(this.db));
  }

  resetDatabase(): void {
    this.db = {
      projects: [],
      tasks: [],
      teamMembers: []
    };
    this.save();
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.db));
  }

  private generateId(prefix: string): string {
    const collection = prefix === 'project' ? this.db.projects :
                       prefix === 'task' ? this.db.tasks :
                       this.db.teamMembers;
    const maxId = Math.max(0, ...collection.map(item => parseInt(item.id) || 0));
    return (maxId + 1).toString();
  }
}
