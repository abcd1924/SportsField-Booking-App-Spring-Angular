import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReservaService } from '../../../services/reserva.service';
import { AuthService } from '../../../services/auth.service';
import { reserva } from '../../../models/reserva';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardModule, ButtonModule, ProgressSpinnerModule, MessageModule, TagModule],
  templateUrl: './dashboard-user.component.html',
  styleUrl: './dashboard-user.component.scss'
})
export class DashboardUserComponent implements OnInit {
  private router = inject(Router);
  private reservaService = inject(ReservaService);
  private authService = inject(AuthService);

  cargando = false;
  error = '';

  nombreUsuario = '';

  reservasActivas: reserva[] = [];
  proximaReserva: reserva | null = null;
  ultimasReservas: reserva[] = [];

  totalReservas = 0;
  horasTotalesJugadas = 0;
  canchasFavoritas: { nombre: string; cantidad: number }[] = [];

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarReservasUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.authService.getCurrentUserForReservations();

    if (usuario) {
      this.nombreUsuario = usuario.nombre;
    }
  }

  private cargarReservasUsuario(): void {
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
        const ahora = new Date();
        this.reservasActivas = reservas.filter(r =>
          r.estado === 'CONFIRMADA' && new Date(r.fechaInicio) > ahora
        );

        if (this.reservasActivas.length > 0) {
          this.proximaReserva = this.reservasActivas
            .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaFin).getTime())[0]
        }

        this.ultimasReservas = reservas
          .sort((a, b) => new Date(b.fechaCreacionReserva).getTime() - new Date(a.fechaCreacionReserva).getTime())
          .slice(0, 3);

        this.calcularEstadisticas(reservas);

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas: ', err);
        this.error = 'No se pudieron cargar las reservas';
        this.cargando = false;
      }
    });
  }

  private calcularEstadisticas(reservas: reserva[]): void {
    this.totalReservas = reservas.filter(r =>
      r.estado === 'CONFIRMADA'
    ).length;

    const ahora = new Date();
    this.horasTotalesJugadas = reservas
      .filter(r => new Date(r.fechaFin) < ahora && r.estado !== 'CANCELADA')
      .reduce((total, r) => total + r.horasTotales, 0);

    const conteoCanchas: { [key: string]: number } = {}
    reservas.forEach(r => {
      const nombreCancha = `${r.canchaDeportiva.tipoCancha} ${r.canchaDeportiva.numeroCancha}`;
      conteoCanchas[nombreCancha] = (conteoCanchas[nombreCancha] || 0) + 1;
    });

    this.canchasFavoritas = Object.entries(conteoCanchas)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 3);
  }

  irAMisReservas(): void {
    this.router.navigate(['/user/mis-reservas']);
  }

  irAPerfil(): void {
    this.router.navigate(['/user/perfil']);
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

  /**
   * Formatea hora para mostrar en el template
   */
  formatearHora(fecha: string | Date): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    
    return fechaObj.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Calcula días restantes hasta una fecha
   */
  diasHasta(fecha: string | Date): number {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const ahora = new Date();
    const diferencia = fechaObj.getTime() - ahora.getTime();
    
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  /**
   * Obtiene el ícono según el tipo de cancha
   */
  getIconoTipoCancha(tipoCancha: string): string {
    const tipo = tipoCancha.toLowerCase();
    
    if (tipo.includes('futbol') || tipo.includes('fútbol')) return '⚽';
    if (tipo.includes('voley') || tipo.includes('voleibol')) return '🏐';
    if (tipo.includes('basket') || tipo.includes('basquet')) return '🏀';
    if (tipo.includes('tenis') || tipo.includes('tennis')) return '🎾';
    
    return '🏟️';
  }

  /**
   * Obtiene el severity del tag según el estado
   */
  getEstadoSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' {
    const severityMap: { [key: string]: 'success' | 'warn' | 'danger' | 'info' } = {
      'CONFIRMADA': 'success',
      'TEMPORAL': 'warn',
      'CANCELADA': 'danger',
      'COMPLETADA': 'info'
    };
    
    return severityMap[estado.toUpperCase()] || 'info';
  }
}