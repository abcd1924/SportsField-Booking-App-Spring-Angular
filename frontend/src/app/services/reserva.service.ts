import { Injectable } from '@angular/core';
import { environment } from '../models/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { reserva } from '../models/reserva';
import { ReservaRequest } from '../models/auxiliares/reservaRequest';
import { AuthService } from './auth.service';
import { ReservasPorDia } from '../models/auxiliares/reservasPorDia';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  listarTodasLasReservas(): Observable<reserva[]> {
    return this.http.get<reserva[]>(this.apiUrl);
  }

  crearReservaTemporal(reservaData: ReservaRequest): Observable<reserva> {
    return this.http.post<reserva>(`${this.apiUrl}/crear-temporal`, reservaData);
  }

  confirmarReserva(id: number): Observable<reserva> {
    return this.http.put<reserva>(`${this.apiUrl}/confirmar/${id}`, {});
  }

  cancelarReserva(id: number): Observable<reserva> {
    return this.http.put<reserva>(`${this.apiUrl}/cancelar/${id}`, {});
  }

  obtenerReservasPorUsuario(usuarioId: number): Observable<reserva[]> {
    return this.http.get<reserva[]>(`${this.apiUrl}/buscar/usuario/${usuarioId}`);
  }

  obtenerReservaPorCodigoUnico(codigoUnico: string): Observable<reserva> {
    return this.http.get<reserva>(`${this.apiUrl}/buscar/codUnico/${codigoUnico}`);
  }

  obtenerReservaPorId(id: number): Observable<reserva> {
    return this.http.get<reserva>(`${this.apiUrl}/buscar/id/${id}`);
  }

  // Métodos de conveniencia

  private obtenerUsuarioActual(): { id: number, nombre: string; email: string } | null {
    return this.authService.getCurrentUserForReservations();
  }

  // Obtiene las reservas del usuario actualmente logueado
  obtenerMisReservas(): Observable<reserva[]> {
    const usuarioActual = this.obtenerUsuarioActual();
    if (!usuarioActual) {
      throw new Error('Usuario no autenticado');
    }
    return this.obtenerReservasPorUsuario(usuarioActual.id);
  }

  puedeCancelarReserva(reserva: reserva): boolean {
    const usuarioActual = this.obtenerUsuarioActual();
    if (!usuarioActual) return false;

    const esDelUsuario = reserva.usuario.id === usuarioActual.id;
    const estadoCancelable = ['PENDIENTE', 'CONFIRMADA'].includes(reserva.estado);
    const esFutura = new Date(reserva.fechaInicio) > new Date();

    return esDelUsuario && estadoCancelable && esFutura;
  }

  formatearEstado(estado: string): { texto: string; clase: string } {
    const estados: { [key: string]: { texto: string; clase: string } } = {
      'PENDIENTE': { texto: 'Pendiente', clase: 'bg-yellow-100 text-yellow-800' },
      'CONFIRMADA': { texto: 'Confirmada', clase: 'bg-green-100 text-green-800' },
      'CANCELADA': { texto: 'Cancelada', clase: 'bg-red-100 text-red-800' }
    };

    return estados[estado] || { texto: estado, clase: 'bg-gray-100 text-gray-800' };
  }

  calcularPrecioTotal(horasTotales: number, precioPorHora: number): number {
    return horasTotales * precioPorHora;
  }

  contarReservasPorRango(inicio: Date, fin: Date): Observable<number> {
    const params = new HttpParams()
      .set('inicio', inicio.toISOString())
      .set('fin', fin.toISOString());
    return this.http.get<number>(`${this.apiUrl}/contar/rango`, { params });
  }

  obtenerReservasPorDia(inicio: Date, fin: Date): Observable<ReservasPorDia[]> {
    const params = new HttpParams()
      .set('inicio', inicio.toISOString())
      .set('fin', fin.toISOString());
    return this.http.get<ReservasPorDia[]>(`${this.apiUrl}/por-dia`, { params });
  }
}