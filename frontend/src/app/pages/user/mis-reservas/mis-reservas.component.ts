import { Component, inject, OnInit } from '@angular/core';
import { ReservaService } from '../../../services/reserva.service';
import { ComprobanteService } from '../../../services/comprobante.service';
import { AuthService } from '../../../services/auth.service';
import { reserva } from '../../../models/reserva';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [ButtonModule, TagModule, CardModule, MessageModule, ProgressSpinnerModule, CommonModule],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss'
})
export class MisReservasComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private comprobanteService = inject(ComprobanteService);
  private authService = inject(AuthService);

  cargando = false;
  error = '';

  todasReservas: reserva[] = [];
  reservasActivas: reserva[] = [];
  reservasPasadas: reserva[] = [];

  tabActivo = 'activas';

  ngOnInit(): void {
    this.cargarReservas()
  }

  private cargarReservas(): void {
    this.cargando = true;
    this.error = '';

    const usuario = this.authService.getCurrentUserForReservations();

    if (!usuario) {
      this.error = 'No se pudo obtener la información del usuario';
      this.cargando = false;
      return;
    }

    this.reservaService.obtenerReservasPorUsuario(usuario.id).subscribe({
      next: (reservas) => {
        this.todasReservas = reservas;
        this.clasificarReservas(reservas);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas: ', err);
        this.error = 'No se pudieron cargar reservas';
        this.cargando = false;
      }
    });
  }

  private clasificarReservas(reservas: reserva[]): void {
    const ahora = new Date();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);

    this.reservasActivas = reservas
      .filter(r => {
        const inicio = new Date(r.fechaInicio);
        return (r.estado === 'CONFIRMADA' || r.estado === 'TEMPORAL') && inicio >= inicioHoy;
      })
      .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());

    this.reservasPasadas = reservas
      .filter(r => {
        const inicio = new Date(r.fechaInicio);
        return inicio < inicioHoy || ['CANCELADA', 'EXPIRADA', 'COMPLETADA'].includes(r.estado);
      })
      .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
  }

  cambiarTab(tab: string): void {
    this.tabActivo = tab;
  }

  get reservasMostradas(): reserva[] {
    switch (this.tabActivo) {
      case 'activas':
        return this.reservasActivas;
      case 'pasadas':
        return this.reservasPasadas;
      case 'todas':
        return this.todasReservas;
      default:
        return [];
    }
  }

  verComprobantePDF(reservaId: number): void {
    this.comprobanteService.buscarComprobantePorReserva(reservaId).subscribe({
      next: (comprobante) => {
        this.comprobanteService.abrirPDFNuevaVentana(comprobante.id);
      },
      error: (err) => {
        console.error('Error al buscar comprobante: ', err);
        alert('No se pudo cargar el comprobante. Por favor, intente nuevamente.');
      }
    });
  }

  descargarComprobantePDF(reservaId: number): void {
    this.comprobanteService.buscarComprobantePorReserva(reservaId).subscribe({
      next: (comprobante) => {
        const nombreArchivo = `comprobante-${comprobante.codigoComprobante}.pdf`;
        this.comprobanteService.descargarPDFDirecto(comprobante.id, nombreArchivo);
      },
      error: (err) => {
        console.error('Error al descargar comprobante:', err);
        alert('No se pudo descargar el comprobante.');
      }
    });
  }

  formatearFecha(fecha: string | Date): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;

    return fechaObj.toLocaleDateString('es-PE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatearHora(fecha: string | Date): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;

    return fechaObj.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  diasHasta(fecha: string | Date): number {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const ahora = new Date();
    const diferencia = fechaObj.getTime() - ahora.getTime();

    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  tieneComprobante(reserva: reserva): boolean {
    return reserva.estado === 'CONFIRMADA' || reserva.estado === 'COMPLETADA';
  }

  getIconoTipoCancha(tipoCancha: string): string {
    const tipo = tipoCancha.toLowerCase();

    if (tipo.includes('futbol') || tipo.includes('fútbol')) return '⚽';
    if (tipo.includes('voley') || tipo.includes('voleibol')) return '🏐';
    if (tipo.includes('basket') || tipo.includes('basquet')) return '🏀';
    if (tipo.includes('tenis') || tipo.includes('tennis')) return '🎾';

    return '🏟️';
  }

  getEstadoSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    const severityMap: { [key: string]: 'success' | 'warn' | 'danger' | 'info' | 'secondary' } = {
      'CONFIRMADA': 'success',
      'TEMPORAL': 'warn',
      'CANCELADA': 'danger',
      'COMPLETADA': 'info',
      'EXPIRADA': 'secondary'
    };

    return severityMap[estado.toUpperCase()] || 'info';
  }

  getEstadoTexto(estado: string): string {
    const textoMap: { [key: string]: string } = {
      'CONFIRMADA': 'Confirmada',
      'TEMPORAL': 'Temporal',
      'CANCELADA': 'Cancelada',
      'COMPLETADA': 'Completada',
      'EXPIRADA': 'Expirada'
    };

    return textoMap[estado.toUpperCase()] || estado;
  }

  recargarReservas(): void {
    this.cargarReservas();
  }
}