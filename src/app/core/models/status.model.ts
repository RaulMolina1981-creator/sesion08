export type StatusType = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';

export interface Status {
  id: string;
  name: StatusType;
  label: string;
  color: string;
  description?: string;
}
