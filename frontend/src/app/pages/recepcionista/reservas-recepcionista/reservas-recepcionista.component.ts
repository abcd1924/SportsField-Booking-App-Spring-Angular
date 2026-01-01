import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva.service';
import { reserva } from '../../../models/reserva';

@Component({
  selector: 'app-reservas-recepcionista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reservas-recepcionista.component.html',
  styleUrl: './reservas-recepcionista.component.scss'
})
export class ReservasRecepcionistaComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private fb = inject(FormBuilder);

  reservas: reserva[] = [];
  showModal = false;
  estadoForm!: FormGroup;
  selectedReserva: reserva | null = null;

  // Filtros
  selectedEstadoFilter: string = '';
  searchTerm: string = '';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Exponer Math para el template
  Math = Math;

  estadosDisponibles = ['TEMPORAL', 'CONFIRMADA', 'CANCELADA'];

  ngOnInit(): void {
    this.initForm();
    this.loadReservas();
  }

  initForm(): void {
    this.estadoForm = this.fb.group({
      estado: ['', Validators.required]
    });
  }

  loadReservas(): void {
    this.reservaService.listarTodasLasReservas().subscribe({
      next: (data: reserva[]) => {
        this.reservas = data.sort((a, b) =>
          new Date(b.fechaCreacionReserva).getTime() - new Date(a.fechaCreacionReserva).getTime()
        );
      },
      error: (error: any) => {
        console.error('Error al cargar reservas:', error);
      }
    });
  }

  get filteredReservas(): reserva[] {
    return this.reservas.filter(r => {
      const matchEstado = !this.selectedEstadoFilter || r.estado === this.selectedEstadoFilter;
      const matchSearch = !this.searchTerm ||
        r.codUnico.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.usuario.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.usuario.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.canchaDeportiva.numeroCancha.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchEstado && matchSearch;
    });
  }

  get paginatedReservas(): reserva[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredReservas.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReservas.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  openEstadoModal(reserva: reserva): void {
    this.selectedReserva = reserva;
    this.estadoForm.patchValue({ estado: reserva.estado });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReserva = null;
    this.estadoForm.reset();
  }

  updateEstado(): void {
    if (this.estadoForm.invalid || !this.selectedReserva) {
      return;
    }

    const nuevoEstado = this.estadoForm.value.estado;
    const reservaId = this.selectedReserva.id;

    // Usar el método apropiado según el estado
    let observable;
    if (nuevoEstado === 'CONFIRMADA') {
      observable = this.reservaService.confirmarReserva(reservaId);
    } else if (nuevoEstado === 'CANCELADA') {
      observable = this.reservaService.cancelarReserva(reservaId);
    } else {
      alert('No se puede cambiar a estado TEMPORAL');
      return;
    }

    observable.subscribe({
      next: () => {
        this.loadReservas();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar el estado de la reserva');
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'CONFIRMADA':
        return 'estado-confirmada';
      case 'TEMPORAL':
        return 'estado-temporal';
      case 'CANCELADA':
        return 'estado-cancelada';
      default:
        return '';
    }
  }

  clearFilters(): void {
    this.selectedEstadoFilter = '';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  calcularTotal(reserva: reserva): number {
    return reserva.horasTotales * reserva.canchaDeportiva.precioPorHora;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
