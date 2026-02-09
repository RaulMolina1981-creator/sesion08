import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonDatabaseService } from './json-database.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataInitializerService {
  constructor(
    private http: HttpClient,
    private jsonDb: JsonDatabaseService
  ) {}

  async initializeDatabase(): Promise<void> {
    try {
      // Verificar si ya hay datos en localStorage
      const stored = localStorage.getItem('projectops_db');
      if (stored) {
        // Ya existen datos, no cargar del JSON
        console.log('Datos cargados desde localStorage');
        return;
      }

      // Cargar datos del archivo JSON
      const data = await firstValueFrom(
        this.http.get('assets/data/db.json')
      );

      // Inicializar la base de datos con los datos del JSON
      this.jsonDb.loadFromJson(data as any);
      console.log('Datos inicializados desde JSON');
    } catch (error) {
      console.warn('No se pudieron cargar datos iniciales:', error);
      // Continuar sin error, usar datos vacíos
    }
  }
}
