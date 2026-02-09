import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastsSource = signal<Toast[]>([]);
  readonly toasts$ = this.toastsSource.asReadonly();

  show(message: string, type: ToastType = 'info', duration: number = 3000) {
    const toast: Toast = {
      id: Date.now().toString(),
      message,
      type,
      duration
    };
    this.toastsSource.set([...this.toastsSource(), toast]);

    setTimeout(() => {
      this.dismiss(toast.id);
    }, duration);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error', 5000); }
  warning(message: string) { this.show(message, 'warning'); }
  info(message: string) { this.show(message, 'info'); }

  dismiss(id: string) {
    this.toastsSource.set(this.toastsSource().filter(t => t.id !== id));
  }
}
