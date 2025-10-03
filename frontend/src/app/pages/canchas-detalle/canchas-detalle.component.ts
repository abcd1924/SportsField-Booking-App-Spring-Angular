import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HorarioDisponible } from '../../models/auxiliares/horarioDisponible';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ActivatedRoute, Router } from '@angular/router';
import { CanchaDeportivaService } from '../../services/cancha-deportiva.service';
import { HorarioCanchaService } from '../../services/horario-cancha.service';
import { AuthService } from '../../services/auth.service';
import { canchaDeportiva } from '../../models/canchaDeportiva';
import { HorarioUtils } from '../../models/utils/horarioUtils';
import { DatePickerModule } from 'primeng/datepicker';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-canchas-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, Select, TagModule, SkeletonModule, MessageModule, DatePickerModule],
  templateUrl: './canchas-detalle.component.html',
  styleUrl: './canchas-detalle.component.scss'
})
export class CanchasDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private canchaService = inject(CanchaDeportivaService);
  private horarioService = inject(HorarioCanchaService);
  private authService = inject(AuthService);
  private reservaService = inject(ReservaService);

  cancha: canchaDeportiva | null = null;
  cargando = false;
  error = '';
  horariosDisponibles: HorarioDisponible[] = [];
  cargandoHorarios = false;

  fechaSeleccionada: Date | null = null;
  horarioSeleccionado: HorarioDisponible | null = null;

  procesandoReserva = false;
  mostrarDialogConfirmacion = false;

  // Configuración del candelario
  fechaMinima = new Date();
  fechaMaxima = new Date();

  private imagenes: { [key: string]: string } = {
    'futbol': 'assets/img/f11.png',
    'fútbol': 'assets/img/f11.png',
    'voley': 'assets/img/voley.png',
    'voleibol': 'assets/img/voley.png',
    'basket': 'assets/img/basket.png',
    'basquet': 'assets/img/basket.png',
    'tenis': 'assets/img/tenis.png',
    'tennis': 'assets/img/tenis.png'
  };

  ngOnInit(): void {
    this.configurarFechas();
    this.cargarDetallesCancha();
  }

  // PASO 1: Configurar las fechas mínimas y máximas para el calendario
  private configurarFechas(): void {
    const hoy = new Date();
    this.fechaMinima = new Date(hoy);
    this.fechaMaxima = new Date(hoy);
    this.fechaMaxima.setDate(hoy.getDate() + 30);
  }

  // PASO 2: Carga los detalles de la cancha desde el backend
  private cargarDetallesCancha(): void {
    const canchaId = this.route.snapshot.params['id'];

    if (!canchaId || isNaN(canchaId)) {
      this.error = 'ID de cancha no válido';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.canchaService.buscarCanchaPorId(Number(canchaId)).subscribe({
      next: (cancha) => {
        if (cancha) {
          this.cancha = cancha;
        } else {
          this.error = 'Cancha no encontrada';
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar cancha: ', err);
        this.error = 'Error al cargar los detalles de la cancha';
        this.cargando = false;
      }
    });
  }

  // PASO 3: Cuando el usuario selecciona una fecha, cargar horarios
  onFechaSeleccionada(): void {
    if (!this.fechaSeleccionada || !this.cancha) return;

    this.horarioSeleccionado = null;
    console.log("Fecha seleccionada: ", this.fechaSeleccionada);
    this.cargarHorariosDisponibles();
  }

  // PASO 4: Carga los horarios disponibles para la fecha seleccionada
  private cargarHorariosDisponibles(): void {
    if (!this.fechaSeleccionada || !this.cancha) return;

    this.cargandoHorarios = true;
    this.horariosDisponibles = [];

    const diaSemana = HorarioUtils.obtenerDiaSemana(this.fechaSeleccionada);

    this.horarioService.obtenerHorariosPorCanchaYDia(this.cancha.id, diaSemana).subscribe({
      next: (horarios) => {
        this.horariosDisponibles = horarios.map(horario => ({
          id: horario.id,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          disponible: horario.disponible,
          precio: this.calcularPrecio(horario.horaInicio, horario.horaFin),
          duracionHoras: HorarioUtils.calcularDuracionHoras(horario.horaInicio, horario.horaFin)
        }));
        this.cargandoHorarios = false;
      },
      error: (err) => {
        console.error('Error al cargar horarios: ', err);
        this.cargandoHorarios = false;
      }
    });
  }

  // PASO 5: Usuario selecciona un horario específico
  seleccionarHorario(horario: HorarioDisponible): void {
    if (!horario.disponible) return;

    this.horarioSeleccionado = horario;
  }

  // PASO 6: Usuario confirma que quiere hacer la reserva
  confirmarReserva(): void {
    if (!this.authService.isFullyAuthenticated()) {
      this.authService.redirectUrl = this.router.url;
      this.router.navigate(['/login']);
      return;
    }

    this.mostrarDialogConfirmacion = true;
  }

  // PASO 7: Crear reserva temporal
  procesarReserva(): void {
    if (!this.cancha || !this.fechaSeleccionada || !this.horarioSeleccionado) return;

    this.procesandoReserva = true;

    const usuarioActual = this.authService.getCurrentUserForReservations();
    if (!usuarioActual) {
      this.error = "Debes iniciar sesión para reservar.";
      this.procesandoReserva = false;
      return;
    }

    const fechaInicio = new Date(this.fechaSeleccionada);
    const [horaInicioHoras, horaInicioMinutos] = this.horarioSeleccionado.horaInicio.split(':').map(Number);
    fechaInicio.setHours(horaInicioHoras, horaInicioMinutos, 0, 0);

    const fechaFin = new Date(this.fechaSeleccionada);
    const [horaFinHoras, horaFinMinutos] = this.horarioSeleccionado.horaFin.split(':').map(Number);
    fechaFin.setHours(horaFinHoras, horaFinMinutos, 0, 0);

    const reservaData = {
      fechaInicio,
      fechaFin,
      canchaDeportiva: { id: this.cancha.id },
      usuario: { id: usuarioActual.id }
    }

    // Reserva temporal
    this.reservaService.crearReservaTemporal(reservaData).subscribe({
      next: (reserva) => {
        this.procesandoReserva = false;
        this.router.navigate(['/reserva/confirmar', reserva.id]);
      },
      error: (err) => {
        this.procesandoReserva = false;
        this.error = "No se puedo crear la reserva. Intente nuevamente.";
        console.error('Error al crear reserva:', err);
      }
    })
  }

  // Métodos Auxiliares
  volverACanchas(): void {
    this.router.navigate(['/canchas']);
  }

  cancelarSeleccion(): void {
    this.horarioSeleccionado = null;
  }

  scrollToReserva(): void {
    document.getElementById('seccion-reserva')?.scrollIntoView({ behavior: 'smooth' });
  }

  private calcularPrecio(horaInicio: string, horaFin: string): number {
    const duracion = HorarioUtils.calcularDuracionHoras(horaInicio, horaFin);
    return duracion * (this.cancha?.precioPorHora || 0);
  }

  getImagenCancha(tipoCancha: string): string {
    if (!tipoCancha) return 'assets/img/img-default.png';

    const tipoLower = tipoCancha.toLowerCase().trim();
    if (this.imagenes[tipoLower]) {
      return this.imagenes[tipoLower];
    }

    const claveEncontrada = Object.keys(this.imagenes).find(clave =>
      tipoLower.includes(clave) || clave.includes(tipoLower)
    );

    return claveEncontrada ? this.imagenes[claveEncontrada] : 'assets/img/img-default.png';
  }

  getIconoTipoCancha(tipoCancha: string): string {
    const tipo = tipoCancha.toLowerCase();

    if (tipo.includes('futbol') || tipo.includes('fútbol')) return '⚽';
    if (tipo.includes('voley') || tipo.includes('voleibol')) return '🏐';
    if (tipo.includes('basket') || tipo.includes('basquet')) return '🏀';
    if (tipo.includes('tenis') || tipo.includes('tennis')) return '🎾';

    return '🏟️';
  }

  getEstadoSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | undefined {
    const estadoMap: { [key: string]: 'success' | 'warn' | 'danger' | 'info' | 'secondary' } = {
      'DISPONIBLE': 'success',
      'ACTIVA': 'success',
      'OCUPADA': 'danger',
      'MANTENIMIENTO': 'warn',
      'INACTIVA': 'secondary'
    };

    return estadoMap[estado.toUpperCase()] || 'info';
  }

  formatearHorario(horaInicio: string, horaFin: string): string {
    return `${horaInicio} - ${horaFin}`;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/img/img-default.png';
  }

  trackByHorarioId(index: number, horario: HorarioDisponible): number {
    return horario.id;
  }
}