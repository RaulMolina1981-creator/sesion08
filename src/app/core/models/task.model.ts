import { StatusType } from './status.model';

export type PriorityType = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string;
  status: StatusType;
  priority: PriorityType;
  dueDate: Date;
  estimatedHours: number;
  spentHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  projectId: string;
  assignedTo: string;
  priority: PriorityType;
  status?: StatusType;
  dueDate: Date;
  estimatedHours: number;
  spentHours?: number;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  status?: StatusType;
  spentHours?: number;
}
