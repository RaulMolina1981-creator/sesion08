import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../../core/services/metrics.service';
import { TaskService } from '../../../core/services/task.service';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner';

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="metrics-container">
      <div class="metrics-header">
        <div class="header-content">
          <h2>Métricas</h2>
          <p class="subtitle">Vista general del rendimiento</p>
        </div>
        <button class="btn-refresh" (click)="onRefresh()">Actualizar</button>
      </div>

      <app-loading-spinner
        *ngIf="metricsService.isLoading$()"
        message="Cargando métricas..."
      ></app-loading-spinner>

      <div class="metrics-content" *ngIf="!metricsService.isLoading$() && metricsService.metrics$()">
        <!-- Summary Stats Row -->
        <div class="summary-stats">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <p class="stat-label">Proyectos Totales</p>
              <p class="stat-value">{{ metricsService.metrics$()?.totalProjects }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">▶️</div>
            <div class="stat-info">
              <p class="stat-label">Proyectos Activos</p>
              <p class="stat-value">{{ metricsService.metrics$()?.activeProjects }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✓</div>
            <div class="stat-info">
              <p class="stat-label">Tareas Completadas</p>
              <p class="stat-value">{{ metricsService.metrics$()?.completedTasks }}</p>
              <p class="stat-percentage">{{ metricsService.taskCompletionRate() }}% completado</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <p class="stat-label">Miembros del Equipo</p>
              <p class="stat-value">{{ metricsService.metrics$()?.teamMembers }}</p>
            </div>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="metrics-grid">
          <!-- Left Column -->
          <div class="metrics-col">
            <div class="metric-card">
              <h4>Proyectos por Tiempo</h4>
              <div class="chart-placeholder">
                <div class="chart-bars">
                  <div class="bar" style="height: 60%"></div>
                  <div class="bar" style="height: 45%"></div>
                  <div class="bar" style="height: 30%"></div>
                  <div class="bar" style="height: 50%"></div>
                  <div class="bar" style="height: 70%"></div>
                </div>
                <p class="chart-label">Gráfico: Proyectos por Tiempo</p>
                <p class="chart-hint">Integrar con ng-charts</p>
              </div>
            </div>

            <div class="metric-card">
              <h4>Tareas por Prioridad</h4>
              <div class="chart-placeholder">
                <div class="chart-bars">
                  <div class="bar" style="height: 40%"></div>
                  <div class="bar" style="height: 60%"></div>
                  <div class="bar" style="height: 50%"></div>
                  <div class="bar" style="height: 30%"></div>
                </div>
                <p class="chart-label">Gráfico: Tareas por Prioridad</p>
                <p class="chart-hint">Integrar con ng-charts</p>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="metrics-col">
            <div class="metric-card">
              <h4>Resumen de Tareas</h4>
              <div class="task-summary">
                <div class="summary-item">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="(metricsService.taskCompletionRate())"></div>
                  </div>
                  <p class="summary-label">{{ metricsService.taskCompletionRate() }}% completado</p>
                </div>
                <div class="summary-breakdown">
                  <div class="breakdown-item pending">
                    <span class="dot"></span>
                    <span>Pendientes</span>
                    <span class="count">{{ getTaskCount('pending') }}</span>
                  </div>
                  <div class="breakdown-item in-progress">
                    <span class="dot"></span>
                    <span>En Progreso</span>
                    <span class="count">{{ getTaskCount('in-progress') }}</span>
                  </div>
                  <div class="breakdown-item completed">
                    <span class="dot"></span>
                    <span>Completadas</span>
                    <span class="count">{{ getTaskCount('completed') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="metric-card">
              <h4>Estadísticas Clave</h4>
              <div class="key-stats">
                <div class="key-stat-item">
                  <span class="label">Tasa de Completación</span>
                  <span class="value">{{ metricsService.projectCompletionRate() }}%</span>
                </div>
                <div class="key-stat-item">
                  <span class="label">Presupuesto Total</span>
                  <span class="value">\${{ (metricsService.metrics$()?.budgetSpent ?? 0) + (metricsService.metrics$()?.budgetRemaining ?? 0) | number }}</span>
                </div>
                <div class="key-stat-item">
                  <span class="label">Presupuesto Gastado</span>
                  <span class="value">\${{ metricsService.metrics$()?.budgetSpent | number }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .metrics-container {
      padding: 24px;
    }

    .metrics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header-content h2 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    .subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }

    .btn-refresh {
      padding: 8px 16px;
      background-color: var(--accent-color);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .btn-refresh:hover {
      background-color: var(--accent-hover);
    }

    .metrics-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Summary Stats */
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .stat-card {
      display: flex;
      gap: 16px;
      padding: 20px;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      align-items: flex-start;
    }

    .stat-icon {
      font-size: 32px;
      line-height: 1;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
      margin: 0;
      text-transform: uppercase;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      margin: 4px 0 0 0;
      color: var(--accent-color);
    }

    .stat-percentage {
      font-size: 12px;
      color: var(--text-muted);
      margin: 4px 0 0 0;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .metrics-col {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .metric-card {
      padding: 24px;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
    }

    .metric-card h4 {
      font-size: 16px;
      color: var(--text-primary);
      margin: 0 0 16px 0;
      font-weight: 600;
    }

    /* Chart Placeholder */
    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 40px 20px;
      background-color: var(--bg-primary);
      border-radius: 8px;
      border: 1px dashed var(--border-color);
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 12px;
      height: 120px;
      width: 100%;
    }

    .bar {
      width: 20px;
      background-color: var(--accent-color);
      border-radius: 4px 4px 0 0;
    }

    .chart-label {
      font-size: 12px;
      color: var(--text-muted);
      margin: 0;
      text-align: center;
    }

    .chart-hint {
      font-size: 11px;
      color: var(--text-muted);
      margin: 0;
      font-style: italic;
    }

    /* Task Summary */
    .task-summary {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-bar {
      width: 100%;
      height: 24px;
      background-color: var(--bg-primary);
      border-radius: 12px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background-color: var(--success-color);
      border-radius: 12px;
      transition: width var(--transition-base);
    }

    .summary-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0;
    }

    .summary-breakdown {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      font-size: 13px;
    }

    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .breakdown-item.pending .dot {
      background-color: var(--warning-color);
    }

    .breakdown-item.in-progress .dot {
      background-color: var(--info-color);
    }

    .breakdown-item.completed .dot {
      background-color: var(--success-color);
    }

    /* Dark mode adjustments for better visibility */
    html[data-theme="dark"] .breakdown-item.pending .dot {
      background-color: #fbbf24;
    }

    html[data-theme="dark"] .breakdown-item.in-progress .dot {
      background-color: #60a5fa;
    }

    html[data-theme="dark"] .breakdown-item.completed .dot {
      background-color: #6ee7b7;
    }

    .breakdown-item .count {
      margin-left: auto;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Key Stats */
    .key-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .key-stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .key-stat-item:last-child {
      border-bottom: none;
    }

    .key-stat-item .label {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .key-stat-item .value {
      font-size: 16px;
      font-weight: 700;
      color: var(--accent-color);
    }
  `]
})
export class MetricsDashboardComponent implements OnInit {
  metricsService = inject(MetricsService);
  taskService = inject(TaskService);

  ngOnInit() {
    this.metricsService.loadMetrics();
    this.taskService.loadTasks();
  }

  onRefresh() {
    this.metricsService.loadMetrics();
    this.taskService.loadTasks();
  }

  getTaskCount(status: string): number {
    return this.taskService.tasks$().filter(t => t.status === status).length;
  }
}
