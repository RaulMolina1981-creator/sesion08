import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { TeamMember } from '../models/team-member.model';

/**
 * Servicio de datos simulados para desarrollo local
 * Proporciona datos de ejemplo para proyectos, tareas y equipo
 */
@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  getMockProjects(): Project[] {
    return [
      {
        id: '1',
        name: 'App Móvil v2.0',
        description: 'Nueva versión de la aplicación móvil con mejoras UX',
        status: 'in-progress',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-30'),
        budget: 50000,
        spent: 32000,
        teamSize: 3,
        progress: 65,
        manager: 'Juan García',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-02-09')
      },
      {
        id: '2',
        name: 'Rediseño Web Corporativo',
        description: 'Actualización completa del sitio web principal',
        status: 'in-progress',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-15'),
        budget: 40000,
        spent: 18000,
        teamSize: 2,
        progress: 45,
        manager: 'María López',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-09')
      },
      {
        id: '3',
        name: 'Sistema de Notificaciones',
        description: 'Implementación de notificaciones push y email',
        status: 'completed',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-20'),
        budget: 25000,
        spent: 25000,
        teamSize: 2,
        progress: 100,
        manager: 'Carlos Ruiz',
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2024-02-20')
      },
      {
        id: '4',
        name: 'Migración Base de Datos',
        description: 'Migración de PostgreSQL a MongoDB',
        status: 'pending',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-06-30'),
        budget: 35000,
        spent: 0,
        teamSize: 2,
        progress: 0,
        manager: 'Roberto López',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-09')
      },
      {
        id: '5',
        name: 'Integración API Pagos',
        description: 'Conexión con pasarela de pagos Stripe',
        status: 'pending',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-05-01'),
        budget: 15000,
        spent: 3000,
        teamSize: 2,
        progress: 20,
        manager: 'Juan García',
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-09')
      }
    ];
  }

  getMockTasks(): Task[] {
    return [
      {
        id: 't1',
        title: 'Diseño de interfaz de usuario',
        description: 'Crear wireframes y diseños en Figma',
        projectId: '1',
        status: 'in-progress',
        priority: 'high',
        assignedTo: 'team1',
        dueDate: new Date('2024-03-15'),
        estimatedHours: 40,
        spentHours: 30,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-09')
      },
      {
        id: 't2',
        title: 'Implementar autenticación',
        description: 'Añadir autenticación con JWT',
        projectId: '1',
        status: 'in-progress',
        priority: 'high',
        assignedTo: 'team2',
        dueDate: new Date('2024-03-20'),
        estimatedHours: 35,
        spentHours: 28,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-09')
      },
      {
        id: 't3',
        title: 'Testing de componentes',
        description: 'Escribir tests unitarios para componentes',
        projectId: '1',
        status: 'pending',
        priority: 'medium',
        assignedTo: 'team3',
        dueDate: new Date('2024-04-01'),
        estimatedHours: 30,
        spentHours: 0,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-09')
      },
      {
        id: 't4',
        title: 'Actualizar estilos CSS',
        description: 'Implementar nuevo sistema de diseño',
        projectId: '2',
        status: 'completed',
        priority: 'medium',
        assignedTo: 'team1',
        dueDate: new Date('2024-03-25'),
        estimatedHours: 25,
        spentHours: 22,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-09')
      },
      {
        id: 't5',
        title: 'Documentación API',
        description: 'Crear documentación OpenAPI/Swagger',
        projectId: '2',
        status: 'pending',
        priority: 'low',
        assignedTo: 'team2',
        dueDate: new Date('2024-04-15'),
        estimatedHours: 20,
        spentHours: 0,
        createdAt: new Date('2024-02-08'),
        updatedAt: new Date('2024-02-09')
      },
      {
        id: 't6',
        title: 'Review de código',
        description: 'Revisar pull requests pendientes',
        projectId: '1',
        status: 'completed',
        priority: 'high',
        assignedTo: 'team3',
        dueDate: new Date('2024-02-28'),
        estimatedHours: 15,
        spentHours: 12,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-27')
      }
    ];
  }

  getMockTeamMembers(): TeamMember[] {
    return [
      {
        id: 'team1',
        name: 'Juan García',
        email: 'juan.garcia@company.com',
        role: 'developer',
        department: 'Engineering',
        active: true,
        joinDate: new Date('2023-01-15'),
        projects: ['1', '5'],
        skills: ['TypeScript', 'Angular', 'Node.js'],
        avatar: 'https://ui-avatars.com/api/?name=Juan+Garcia&background=random',
        createdAt: new Date('2023-01-10')
      },
      {
        id: 'team2',
        name: 'María López',
        email: 'maria.lopez@company.com',
        role: 'manager',
        department: 'Product',
        active: true,
        joinDate: new Date('2022-06-01'),
        projects: ['1', '2'],
        skills: ['Project Management', 'Agile', 'Leadership'],
        avatar: 'https://ui-avatars.com/api/?name=Maria+Lopez&background=random',
        createdAt: new Date('2022-05-25')
      },
      {
        id: 'team3',
        name: 'Carlos Ruiz',
        email: 'carlos.ruiz@company.com',
        role: 'qa',
        department: 'Quality Assurance',
        active: true,
        joinDate: new Date('2023-03-10'),
        projects: ['1', '2'],
        skills: ['Testing', 'Automation', 'QA'],
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Ruiz&background=random',
        createdAt: new Date('2023-03-05')
      },
      {
        id: 'team4',
        name: 'Ana Martínez',
        email: 'ana.martinez@company.com',
        role: 'designer',
        department: 'Design',
        active: true,
        joinDate: new Date('2023-05-20'),
        projects: ['1', '2'],
        skills: ['UI Design', 'Figma', 'UX Research'],
        avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=random',
        createdAt: new Date('2023-05-15')
      },
      {
        id: 'team5',
        name: 'Pedro Sánchez',
        email: 'pedro.sanchez@company.com',
        role: 'developer',
        department: 'Engineering',
        active: false,
        joinDate: new Date('2023-02-01'),
        projects: [],
        skills: ['Python', 'PostgreSQL', 'REST APIs'],
        avatar: 'https://ui-avatars.com/api/?name=Pedro+Sanchez&background=random',
        createdAt: new Date('2023-01-28')
      },
      {
        id: 'team6',
        name: 'Roberto López',
        email: 'roberto.lopez@company.com',
        role: 'devops',
        department: 'Infrastructure',
        active: true,
        joinDate: new Date('2022-11-10'),
        projects: ['4'],
        skills: ['Docker', 'Kubernetes', 'CI/CD'],
        avatar: 'https://ui-avatars.com/api/?name=Roberto+Lopez&background=random',
        createdAt: new Date('2022-11-05')
      },
      {
        id: 'team7',
        name: 'Sofía García',
        email: 'sofia.garcia@company.com',
        role: 'developer',
        department: 'Analytics',
        active: true,
        joinDate: new Date('2023-07-15'),
        projects: ['3'],
        skills: ['Data Analysis', 'SQL', 'Python', 'Dashboards'],
        avatar: 'https://ui-avatars.com/api/?name=Sofia+Garcia&background=random',
        createdAt: new Date('2023-07-10')
      }
    ];
  }
}
