import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../models/environment';
import { comprobante } from '../models/comprobante';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comprobantes`;

  generarComprobantePorReserva(reservaId: number): Observable<comprobante> {
    return this.http.post<comprobante>(`${this.apiUrl}/generar/${reservaId}`, {});
  }

  buscarComprobantePorReserva(reservaId: number): Observable<comprobante> {
    return this.http.get<comprobante>(`${this.apiUrl}/buscar/reservaId/${reservaId}`);
  }

  descargarComprobantePDF(comprobanteId: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(`${this.apiUrl}/descargar/${comprobanteId}`, {
      headers: headers,
      responseType: 'blob'
    })
  }

  obtenerComprobantePorId(comprobanteId: number): Observable<comprobante> {
    return this.http.get<comprobante>(`${this.apiUrl}/${comprobanteId}`);
  }

  listarComprobantes(): Observable<comprobante[]> {
    return this.http.get<comprobante[]>(this.apiUrl);
  }

  buscarComprobantesPorFecha(fechaInicio: Date, fechaFin: Date): Observable<comprobante[]> {
    const params = new HttpParams()
      .set('inicio', fechaInicio.toISOString())
      .set('fin', fechaFin.toISOString());

    return this.http.get<comprobante[]>(`${this.apiUrl}/buscar/fechaEmisionEntre`, { params });
  }

  // Métodos auxiliares

  descargarPDFDirecto(comprobanteId: number, nombreActivo?: string): void {
    this.descargarComprobantePDF(comprobanteId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);

        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = nombreActivo || `comprobante-${comprobanteId}.pdf`;

        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);

        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar PDF: ', error);
      }
    })
  }

  abrirPDFNuevaVentana(comprobanteId: number): void {
    this.descargarComprobantePDF(comprobanteId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      },
      error: (error) => {
        console.error('Error al abrir PDF: ', error);
      }
    })
  }

  formatearFechaComprobante(fecha: string | Date): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;

    return fechaObj.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearMonto(monto: number): string {
    return `S/ ${monto.toFixed(2)}`;
  }

  constructor() { }

  calcularIngresosPorRango(inicio: Date, fin: Date): Observable<number> {
    const params = new HttpParams()
      .set('inicio', inicio.toISOString())
      .set('fin', fin.toISOString());
    return this.http.get<number>(`${this.apiUrl}/ingresos/rango`, { params });
  }
}