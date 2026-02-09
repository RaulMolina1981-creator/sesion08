import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string) {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(
      finalize(() => this.isLoading.set(false)),
      catchError(err => this.handleError(err))
    );
  }

  post<T>(endpoint: string, body: any) {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      finalize(() => this.isLoading.set(false)),
      catchError(err => this.handleError(err))
    );
  }

  put<T>(endpoint: string, body: any) {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      finalize(() => this.isLoading.set(false)),
      catchError(err => this.handleError(err))
    );
  }

  delete<T>(endpoint: string) {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(
      finalize(() => this.isLoading.set(false)),
      catchError(err => this.handleError(err))
    );
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = error.error?.message || 'An unexpected error occurred';
    this.error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  clearError() {
    this.error.set(null);
  }
}
