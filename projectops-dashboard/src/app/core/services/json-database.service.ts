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
    } else {
      this.db = {
        projects: [],
        tasks: [],
        teamMembers: []
      };
    }
  }

  // ==================== PROJECTS ====================
  getProjects(): any[] {
    return [...this.db.projects];
  }

  getProjectById(id: string): any {
    return this.db.projects.find(p => p.id === id);
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
      spent: project.spent || 0
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
      this.db.projects.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // ==================== TASKS ====================
  getTasks(): any[] {
    return [...this.db.tasks];
  }

  getTaskById(id: string): any {
    return this.db.tasks.find(t => t.id === id);
  }

  createTask(task: any): any {
    const newTask = {
      ...task,
      id: this.generateId('task'),
      status: task.status || 'pending',
      spentHours: task.spentHours || 0,
      createdAt: new Date(),
      updatedAt: new Date()
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
      this.db.tasks.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // ==================== TEAM MEMBERS ====================
  getTeamMembers(): any[] {
    return [...this.db.teamMembers];
  }

  getTeamMemberById(id: string): any {
    return this.db.teamMembers.find(m => m.id === id);
  }

  createTeamMember(member: any): any {
    const newMember = {
      ...member,
      id: this.generateId('member'),
      active: true,
      joinDate: new Date(),
      projects: [],
      createdAt: new Date()
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
      this.db.teamMembers.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // ==================== DATABASE MANAGEMENT ====================
  loadFromJson(jsonData: Database): void {
    this.db = JSON.parse(JSON.stringify(jsonData));
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
