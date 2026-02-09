export type RoleType = 'developer' | 'designer' | 'manager' | 'qa' | 'devops';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar?: string;
  department: string;
  joinDate: Date;
  active: boolean;
  projects: string[];
  skills: string[];
  createdAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface CreateTeamMemberDTO {
  name: string;
  email: string;
  role: RoleType;
  department: string;
  skills: string[];
}

export interface UpdateTeamMemberDTO extends Partial<CreateTeamMemberDTO> {
  active?: boolean;
  projects?: string[];
}
