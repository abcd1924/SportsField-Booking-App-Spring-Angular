import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { canchaDeportiva } from '../models/canchaDeportiva';
import { environment } from '../models/environment';

@Injectable({
  providedIn: 'root'
})
export class CanchaDeportivaService {
  private apiUrl = `${environment.apiUrl}/canchas-deportivas`;

  constructor(private http: HttpClient) { }

  obtenerCanchas(): Observable<canchaDeportiva[]> {
    return this.http.get<canchaDeportiva[]>(this.apiUrl);
  }

  crearCancha(cancha: Omit<canchaDeportiva, 'id'>): Observable<canchaDeportiva> {
    return this.http.post<canchaDeportiva>(`${this.apiUrl}/crear`, cancha);
  }

  actualizarCancha(id: number, cancha: canchaDeportiva): Observable<canchaDeportiva> {
    return this.http.put<canchaDeportiva>(`${this.apiUrl}/editar/${id}`, cancha);
  }

  eliminarCancha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  obtenerCanchasActivas(): Observable<canchaDeportiva[]> {
    return this.http.get<canchaDeportiva[]>(`${this.apiUrl}/activas`);
  }

  buscarCanchaPorTipo(tipo: string): Observable<canchaDeportiva[]> {
    return this.http.get<canchaDeportiva[]>(`${this.apiUrl}/buscar/tipo/${tipo}`);
  }

  buscarCanchaPorNumero(numero: string): Observable<canchaDeportiva[]> {
    return this.http.get<canchaDeportiva[]>(`${this.apiUrl}/buscar/numero/${numero}`);
  }

  buscarCanchaPorId(id: number): Observable<canchaDeportiva> {
    return this.http.get<canchaDeportiva>(`${this.apiUrl}/buscar/${id}`);
  }

  buscarCanchasDisponibles(fechaInicio: Date, fechaFin: Date): Observable<canchaDeportiva[]> {
    const params = {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString()
    }
    return this.http.get<canchaDeportiva[]>(`${this.apiUrl}/disponibles`, { params });
  }
}
