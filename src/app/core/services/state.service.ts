import { Injectable, signal } from '@angular/core';

export interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly initialState: AppState = {
    sidebarOpen: true,
    theme: 'light',
    user: null,
    notifications: []
  };

  private readonly stateSource = signal<AppState>(this.initialState);

  readonly state$ = this.stateSource.asReadonly();

  constructor() {
    this.loadStateFromStorage();
  }

  private loadStateFromStorage() {
    const saved = localStorage.getItem('appState');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        this.stateSource.set(parsedState);
      } catch (e) {
        console.error('Failed to load state from storage:', e);
      }
    }
  }

  setState(updates: Partial<AppState>) {
    const current = this.stateSource();
    const newState = { ...current, ...updates };
    this.stateSource.set(newState);
    this.saveStateToStorage(newState);
  }

  private saveStateToStorage(state: AppState) {
    try {
      localStorage.setItem('appState', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to storage:', e);
    }
  }

  toggleSidebar() {
    const current = this.stateSource();
    this.setState({ sidebarOpen: !current.sidebarOpen });
  }

  toggleTheme() {
    const current = this.stateSource();
    const newTheme = current.theme === 'light' ? 'dark' : 'light';
    this.setState({ theme: newTheme });
  }

  setUser(user: AppState['user']) {
    this.setState({ user });
  }

  addNotification(notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) {
    const current = this.stateSource();
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    this.setState({
      notifications: [newNotification, ...current.notifications].slice(0, 10)
    });
  }

  removeNotification(id: string) {
    const current = this.stateSource();
    this.setState({
      notifications: current.notifications.filter(n => n.id !== id)
    });
  }

  resetState() {
    this.stateSource.set(this.initialState);
    localStorage.removeItem('appState');
  }
}
