import { Injectable, signal, computed } from '@angular/core';
import { JsonDatabaseService } from './json-database.service';
import { TeamMember, CreateTeamMemberDTO, UpdateTeamMemberDTO, RoleType } from '../models/team-member.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly membersSource = signal<TeamMember[]>([]);
  private readonly loadingSource = signal(false);

  readonly members$ = this.membersSource.asReadonly();
  readonly isLoading$ = this.loadingSource.asReadonly();

  readonly activeMembers = computed(() =>
    this.membersSource().filter(m => m.active)
  );

  readonly membersByRole = computed(() => {
    const members = this.membersSource();
    const grouped: Record<RoleType, TeamMember[]> = {
      developer: [],
      designer: [],
      manager: [],
      qa: [],
      devops: []
    };

    members.forEach(member => {
      grouped[member.role].push(member);
    });

    return grouped;
  });

  readonly memberCount = computed(() => this.membersSource().length);

  constructor(private jsonDb: JsonDatabaseService) {}

  loadTeamMembers() {
    this.loadingSource.set(true);
    const members = this.jsonDb.getTeamMembers();
    this.membersSource.set(members);
    this.loadingSource.set(false);

    // En producción, descomenta esto:
    // this.apiService.get<TeamMember[]>('/team').subscribe({
    //   next: (members) => {
    //     this.membersSource.set(members);
    //     this.loadingSource.set(false);
    //   },
    //   error: (err) => {
    //     console.error('Error loading team members:', err);
    //     this.loadingSource.set(false);
    //   }
    // });
  }

  getMemberById(id: string) {
    return this.membersSource().find(m => m.id === id);
  }

  createMember(member: CreateTeamMemberDTO) {
    this.loadingSource.set(true);
    const newMember = this.jsonDb.createTeamMember(member);
    this.membersSource.set([...this.membersSource(), newMember]);
    this.loadingSource.set(false);
  }

  updateMember(id: string, updates: UpdateTeamMemberDTO) {
    this.loadingSource.set(true);
    const updatedMember = this.jsonDb.updateTeamMember(id, updates);
    if (updatedMember) {
      const members = this.membersSource();
      const index = members.findIndex(m => m.id === id);
      if (index > -1) {
        members[index] = updatedMember;
        this.membersSource.set([...members]);
      }
    }
    this.loadingSource.set(false);
  }

  deactivateMember(id: string) {
    this.updateMember(id, { active: false });
  }

  removeMember(id: string) {
    this.loadingSource.set(true);
    this.jsonDb.deleteTeamMember(id);
    this.membersSource.set(
      this.membersSource().filter(m => m.id !== id)
    );
    this.loadingSource.set(false);
  }

  restoreMember(id: string) {
    this.loadingSource.set(true);
    this.jsonDb.restoreTeamMember(id);
    this.loadTeamMembers();
    this.loadingSource.set(false);
  }

  permanentDeleteMember(id: string) {
    this.loadingSource.set(true);
    this.jsonDb.permanentDeleteTeamMember(id);
    this.loadingSource.set(false);
  }
}
