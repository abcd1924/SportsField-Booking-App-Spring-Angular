import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprobanteService } from '../../services/comprobante.service';
import { comprobante } from '../../models/comprobante';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-comprobante',
  standalone: true,
  imports: [CommonModule, ButtonModule, DividerModule, TagModule, CardModule, MessageModule, ProgressSpinnerModule],
  templateUrl: './comprobante.component.html',
  styleUrl: './comprobante.component.scss'
})
export class ComprobanteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comprobanteService = inject(ComprobanteService);

  comprobante: comprobante | null = null;
  cargando = false;
  error = '';

  ngOnInit(): void {
    const comprobanteId = this.route.snapshot.params['comprobanteId'];

    if (!comprobanteId || isNaN(comprobanteId)) {
      this.error = 'ID de comprobante no válido';
      return;
    }

    this.cargarComprobante(Number(comprobanteId));
  }

  private cargarComprobante(comprobanteId: number): void {
    this.cargando = true;
    this.error = '';
    this.comprobanteService.obtenerComprobantePorId(comprobanteId).subscribe({
      next: (comprobante) => {
        this.comprobante = comprobante;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar comprobante:', err);
        this.error = 'No se pudo cargar el comprobante';
        this.cargando = false;
      }
    })
  }

  verPDF(): void {
    if (!this.comprobante) return;

    this.comprobanteService.abrirPDFNuevaVentana(this.comprobante.id);
  }

  descargarPDF(): void {
    if (!this.comprobante) return;

    const nombreArchivo = `comprobante-${this.comprobante.codigoComprobante}.pdf`;
    this.comprobanteService.descargarPDFDirecto(this.comprobante.id, nombreArchivo);
  }

  irAMisReservas(): void {
    this.router.navigate(['/user/mis-reservas']);
  }

  volverACanchas(): void {
    this.router.navigate(['/canchas']);
  }

  get fechaEmisionFormateada(): string {
    if (!this.comprobante) return '';
    return this.comprobanteService.formatearFechaComprobante(this.comprobante.fechaEmision);
  }

  get fechaReservaFormateada(): string {
    if (!this.comprobante?.reserva) return '';

    const fecha = typeof this.comprobante.reserva.fechaInicio === 'string'
      ? new Date(this.comprobante.reserva.fechaInicio)
      : this.comprobante.reserva.fechaInicio;

    return fecha.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get horaInicio(): string {
    if (!this.comprobante?.reserva) return '';

    const fecha = typeof this.comprobante.reserva.fechaInicio === 'string'
      ? new Date(this.comprobante.reserva.fechaInicio)
      : this.comprobante.reserva.fechaInicio;

    return fecha.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get horaFin(): string {
    if (!this.comprobante?.reserva) return '';

    const fecha = typeof this.comprobante.reserva.fechaFin === 'string'
      ? new Date(this.comprobante.reserva.fechaFin)
      : this.comprobante.reserva.fechaFin;

    return fecha.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get subtotalFormateado(): string {
    if (!this.comprobante) return 'S/ 0.00';
    return this.comprobanteService.formatearMonto(this.comprobante.subtotal);
  }

  get igvFormateado(): string {
    if (!this.comprobante) return 'S/ 0.00';
    return this.comprobanteService.formatearMonto(this.comprobante.igv);
  }

  get totalFormateado(): string {
    if (!this.comprobante) return 'S/ 0.00';
    return this.comprobanteService.formatearMonto(this.comprobante.total);
  }

  get nombreCompletoUsuario(): string {
    if (!this.comprobante?.reserva?.usuario) return '';
    return `${this.comprobante.reserva.usuario.nombre} ${this.comprobante.reserva.usuario.apellido}`;
  }

  getIconoTipoCancha(tipoCancha: string): string {
    const tipo = tipoCancha.toLowerCase();

    if (tipo.includes('futbol') || tipo.includes('fútbol')) return '⚽';
    if (tipo.includes('voley') || tipo.includes('voleibol')) return '🏐';
    if (tipo.includes('basket') || tipo.includes('basquet')) return '🏀';
    if (tipo.includes('tenis') || tipo.includes('tennis')) return '🎾';

    return '🏟️';
  }
}