import { StatusType } from './status.model';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: StatusType;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  teamSize: number;
  progress: number;
  manager: string;
  team?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  manager: string;
  team?: string;
  teamSize?: number;
  spent?: number;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  status?: StatusType;
  progress?: number;
}
