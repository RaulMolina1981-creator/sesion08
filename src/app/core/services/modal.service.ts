import { Injectable, signal } from '@angular/core';

export interface ModalConfig<T = any> {
  component: string;
  data?: T;
  onConfirm?: (data: T) => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly isOpenSource = signal(false);
  private readonly configSource = signal<ModalConfig | null>(null);

  readonly isOpen$ = this.isOpenSource.asReadonly();
  readonly config$ = this.configSource.asReadonly();

  open<T = any>(config: ModalConfig<T>) {
    this.configSource.set(config as ModalConfig);
    this.isOpenSource.set(true);
  }

  close() {
    this.isOpenSource.set(false);
    this.configSource.set(null);
  }

  confirm(data: any) {
    const config = this.configSource();
    if (config?.onConfirm) {
      config.onConfirm(data);
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
}
