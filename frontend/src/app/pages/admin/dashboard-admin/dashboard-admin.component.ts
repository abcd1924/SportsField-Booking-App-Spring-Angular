import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservaService } from '../../../services/reserva.service';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { ComprobanteService } from '../../../services/comprobante.service';
import { CanchaDeportivaService } from '../../../services/cancha-deportiva.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private comprobanteService = inject(ComprobanteService);
  private canchaService = inject(CanchaDeportivaService);


  adminName: string | null = 'Administrador';
  currentDate: Date = new Date();

  reservasHoy: number = 0;
  ingresosHoy: number = 0;
  nuevosUsuarios: number = 0;
  canchasActivas: number = 0;

  // Datos para el gráfico de la semana (se cargarán dinámicamente)
  weekData: { day: string, value: number }[] = [];

  get maxValue(): number {
    if (this.weekData.length === 0) return 1;
    return Math.max(...this.weekData.map(d => d.value));
  }

  getBarHeight(value: number): number {
    if (value === 0) return 0;
    const maxHeight = 250; // Altura máxima en píxeles
    const minHeight = 40;  // Altura mínima visible
    const calculatedHeight = (value / this.maxValue) * maxHeight;
    return Math.max(minHeight, calculatedHeight);
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUserForReservations();
    if (user && user.nombre) this.adminName = user.nombre;

    this.loadStats();
  }

  loadStats(): void {
    // Obtener el rango de fechas para "hoy"
    const hoy = new Date();
    const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

    // Obtener el rango de los últimos 7 días para el gráfico
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 6);
    const inicioSemana = new Date(hace7Dias.getFullYear(), hace7Dias.getMonth(), hace7Dias.getDate(), 0, 0, 0);
    const finSemana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

    // Cargar todas las estadísticas en paralelo usando forkJoin
    forkJoin({
      reservas: this.reservaService.contarReservasPorRango(inicioDelDia, finDelDia),
      ingresos: this.comprobanteService.calcularIngresosPorRango(inicioDelDia, finDelDia),
      usuarios: this.usersService.contarUsuariosNuevos(inicioDelDia, finDelDia),
      canchas: this.canchaService.obtenerCanchasActivas(),
      reservasPorDia: this.reservaService.obtenerReservasPorDia(inicioSemana, finSemana)
    }).subscribe({
      next: (resultados) => {
        this.reservasHoy = resultados.reservas;
        this.ingresosHoy = resultados.ingresos;
        this.nuevosUsuarios = resultados.usuarios;
        this.canchasActivas = resultados.canchas.length;

        // Procesar datos del gráfico
        this.procesarDatosGrafico(resultados.reservasPorDia, inicioSemana);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas del dashboard:', error);
        // Mantener los valores en 0 en caso de error
        this.inicializarGraficoVacio();
      }
    });
  }

  private procesarDatosGrafico(datos: any[], inicioSemana: Date): void {
    // Crear array con los últimos 7 días
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const ultimos7Dias: { day: string, value: number }[] = [];

    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana);
      fecha.setDate(fecha.getDate() + i);
      const fechaStr = fecha.toISOString().split('T')[0];
      const diaSemana = diasSemana[fecha.getDay()];

      // Buscar si hay datos para este día
      const datoDelDia = datos.find(d => d.fecha === fechaStr);
      ultimos7Dias.push({
        day: diaSemana,
        value: datoDelDia ? datoDelDia.cantidad : 0
      });
    }

    this.weekData = ultimos7Dias;
  }

  private inicializarGraficoVacio(): void {
    this.weekData = [
      { day: 'Lun', value: 0 },
      { day: 'Mar', value: 0 },
      { day: 'Mié', value: 0 },
      { day: 'Jue', value: 0 },
      { day: 'Vie', value: 0 },
      { day: 'Sáb', value: 0 },
      { day: 'Dom', value: 0 }
    ];
  }
}
