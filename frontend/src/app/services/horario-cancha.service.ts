import { Injectable } from '@angular/core';
import { environment } from '../models/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { horarioCancha } from '../models/horarioCancha';

@Injectable({
  providedIn: 'root'
})
export class HorarioCanchaService {
  private apiUrl = `${environment.apiUrl}/horarios-canchas`;

  constructor(private http: HttpClient) { }

  obtenerTodosLosHorarios(): Observable<horarioCancha[]> {
    return this.http.get<horarioCancha[]>(this.apiUrl);
  }

  obtenerHorariosPorCanchaYDia(canchaId: number, diaSemana: string): Observable<horarioCancha[]> {
    const params = new HttpParams()
      .set('canchaId', canchaId.toString())
      .set('diaSemana', diaSemana);

    return this.http.get<horarioCancha[]>(`${this.apiUrl}/buscar/cancha-dia`, { params });
  }

  validarDisponibilidadHorario(canchaId: number, dia: string, hora: string): Observable<horarioCancha | null> {
    const params = new HttpParams()
      .set('canchaId', canchaId.toString())
      .set('dia', dia)
      .set('hora', hora);

    return this.http.get<{ present: boolean, value?: horarioCancha }>(`${this.apiUrl}/disponibilidad-horario`, { params })
      .pipe(
        map(response => response.present ? response.value! : null)
      );
  }

  validadDisponibilidadParaReserva(canchaId: number, fecha: string, hora: string, duracionHoras: number): Observable<boolean> {
    const params = new HttpParams()
      .set('canchaId', canchaId.toString())
      .set('fecha', fecha)
      .set('hora', hora)
      .set('duracionHoras', duracionHoras.toString());

    return this.http.get<boolean>(`${this.apiUrl}/disponibilidad-reserva`, { params });
  }

  crearHorario(horario: Omit<horarioCancha, 'id'>): Observable<string> {
    return this.http.post(`${this.apiUrl}/crear`, horario, { responseType: 'text' });
  }

  actualizarHorario(id: number, horario: horarioCancha): Observable<horarioCancha> {
    return this.http.put<horarioCancha>(`${this.apiUrl}/editar/${id}`, horario);
  }

  eliminarHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  // Obtiene todos los horarios de una cancha (todos los días)
  obtenerTodosLosHorariosPorCancha(canchaId: number): Observable<horarioCancha[]> {
    const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];

    const horariosPorDia = diasSemana.map(dia =>
      this.obtenerHorariosPorCanchaYDia(canchaId, dia)
    );

    return new Observable(observer => {
      Promise.all(horariosPorDia.map(obs => obs.toPromise()))
        .then(resultados => {
          const todosLosHorarios = resultados.flat().filter(h => h !== undefined);
          observer.next(todosLosHorarios as horarioCancha[]);
          observer.complete();
        })
          .catch(error => observer.error(error));
    })
  }

  // Obtiene horarios dipsponibles de una cancha para un día específico - disponible = true
  obtenerHorariosDisponibles(canchaId: number, diaSemana: string): Observable<horarioCancha[]> {
    return this.obtenerHorariosPorCanchaYDia(canchaId, diaSemana)
      .pipe(
        map(horarios => horarios.filter(h => h.disponible))
      );
  }
}