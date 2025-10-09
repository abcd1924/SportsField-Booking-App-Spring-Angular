import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReservaRequest } from '../../models/auxiliares/reservaRequest';
import { ReservaService } from '../../services/reserva.service';
import { reserva } from '../../models/reserva';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprobanteService } from '../../services/comprobante.service';
import { interval, Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-reserva-confirmar',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule, MessageModule, TagModule, DividerModule],
  templateUrl: './reserva-confirmar.component.html',
  styleUrl: './reserva-confirmar.component.scss'
})
export class ReservaConfirmarComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reservaService = inject(ReservaService);
  private comprobanteService = inject(ComprobanteService);

  reserva: reserva | null = null;
  cargando = false;
  error = '';

  tiempoRestanteSegundos = 15 * 60;
  timerSubscription: Subscription | null = null;

  procesandoConfirmacion = false;
  reservaExpirada = false;

  constructor() { }

  ngOnInit(): void {
    const reservaId = this.route.snapshot.params['reservaId'];

    if (!reservaId || isNaN(reservaId)) {
      this.error = 'ID de reserva no válido';
      return;
    }

    this.cargarReserva(Number(reservaId));
    this.iniciarTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // PASO 1: Cargar los detalles de la reserva TEMPORAL
  private cargarReserva(reservaId: number): void {
    this.cargando = true;
    this.error = '';

    this.reservaService.obtenerReservaPorId(reservaId).subscribe({
      next: (reserva) => {
        if (reserva.estado !== 'TEMPORAL') {
          this.error = 'Esta reserva ya no está disponible para confirmación';
          this.cargando = false;
          return;
        }

        this.reserva = reserva;
        this.calcularTiempoRestante(reserva.fechaCreacionReserva);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reserva: ', err);
        this.error = 'Error al cargar los detalles de la reserva';
        this.cargando = false;
      }
    });
  }

  // PASO 2: Iniciar el timer de 15 minutos
  private iniciarTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.tiempoRestanteSegundos--;

      if (this.tiempoRestanteSegundos <= 0) {
        this.manejarExpiracion();
      }
    });
  }

  // PASO 3: Calcular tiempo restante basado en fecha de creación
  private calcularTiempoRestante(fechaCreacionReserva: string | Date): void {
    const fechaCreacionDate = typeof fechaCreacionReserva === 'string'
      ? new Date(fechaCreacionReserva)
      : fechaCreacionReserva;

    const ahora = new Date();
    const tiempoTranscurrido = Math.floor((ahora.getTime() - fechaCreacionDate.getTime()) / 1000);
    const tiempoLimite = 15 * 60;

    this.tiempoRestanteSegundos = tiempoLimite - tiempoTranscurrido;

    if (this.tiempoRestanteSegundos <= 0) {
      this.manejarExpiracion();
    }
  }

  // PASO 4: Manejar la expiración del timer
  private manejarExpiracion(): void {
    this.reservaExpirada = true;
    this.tiempoRestanteSegundos = 0;

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    setTimeout(() => {
      this.router.navigate(['/canchas']);
    }, 3000);
  }

  // PASO 5: Confirmar la reserva. Método que ejecuta todo el flujo
  confirmarReserva(): void {
    if (!this.reserva || this.procesandoConfirmacion || this.reservaExpirada) {
      return;
    }

    this.procesandoConfirmacion = true;

    this.reservaService.confirmarReserva(this.reserva.id).subscribe({
      next: (reservaConfirmada) => {
        this.comprobanteService.generarComprobantePorReserva(reservaConfirmada.id).subscribe({
          next: (comprobante) => {
            this.procesandoConfirmacion = false;
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe();
            }
            this.router.navigate(['/reserva/comprobante', comprobante.id]);
          },
          error: (err) => {
            console.error('Error al generar comprobante: ', err);
            this.error = 'Error al generar el comprobante';
            this.procesandoConfirmacion = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al confirmar reserva:', err);
        this.error = 'Error al confirmar la reserva';
        this.procesandoConfirmacion = false;
      }
    });
  }

  // PASO 6: Cancelar la reserva
  cancelarReserva(): void {
    if (!this.reserva || this.procesandoConfirmacion) {
      return;
    }

    this.reservaService.cancelarReserva(this.reserva.id).subscribe({
      next: () => {
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }

        this.router.navigate(['/canchas']);
      },
      error: (err) => {
        console.error('Error al cancelar reserva:', err);
        this.error = 'Error al cancelar la reserva';
      }
    });
  }

  // Métodos auxiliares
  get timerFormateado(): string {
    const minutos = Math.floor(this.tiempoRestanteSegundos / 60);
    const segundos = this.tiempoRestanteSegundos % 60;
    
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }

  get timerColor(): string {
    if (this.tiempoRestanteSegundos > 300) return 'text-green-600';
    if (this.tiempoRestanteSegundos > 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  formatearFecha(fecha: string | Date): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    
    return fechaObj.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  formatearMonto(monto: number): string {
    return `S/ ${monto.toFixed(2)}`;
  }

  get precioTotal(): number {
    if (!this.reserva) return 0;
    return this.reserva.horasTotales * this.reserva.canchaDeportiva.precioPorHora;
  }
}