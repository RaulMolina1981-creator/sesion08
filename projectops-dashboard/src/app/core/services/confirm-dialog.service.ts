import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private readonly isOpenSource = signal(false);
  private readonly configSource = signal<ConfirmDialogConfig | null>(null);

  readonly isOpen$ = this.isOpenSource.asReadonly();
  readonly config$ = this.configSource.asReadonly();

  open(config: ConfirmDialogConfig) {
    this.configSource.set(config);
    this.isOpenSource.set(true);
  }

  confirm() {
    const config = this.configSource();
    if (config?.onConfirm) {
      config.onConfirm();
    }
    this.close();
  }

  cancel() {
    const config = this.configSource();
    if (config?.onCancel) {
      config.onCancel();
    }
    this.close();
  }

  private close() {
    this.isOpenSource.set(false);
    this.configSource.set(null);
  }
}
