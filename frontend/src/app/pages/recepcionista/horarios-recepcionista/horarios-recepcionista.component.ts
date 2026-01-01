import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HorarioCanchaService } from '../../../services/horario-cancha.service';
import { CanchaDeportivaService } from '../../../services/cancha-deportiva.service';
import { horarioCancha } from '../../../models/horarioCancha';
import { canchaDeportiva } from '../../../models/canchaDeportiva';

@Component({
  selector: 'app-horarios-recepcionista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './horarios-recepcionista.component.html',
  styleUrl: './horarios-recepcionista.component.scss'
})
export class HorariosRecepcionistaComponent implements OnInit {
  private horarioService = inject(HorarioCanchaService);
  private canchaService = inject(CanchaDeportivaService);
  private fb = inject(FormBuilder);

  horarios: horarioCancha[] = [];
  canchas: canchaDeportiva[] = [];
  showModal = false;
  isEditMode = false;
  horarioForm!: FormGroup;
  selectedHorarioId: number | null = null;

  // Filtros
  selectedCanchaFilter: number | null = null;
  selectedDiaFilter: string = '';

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  ngOnInit(): void {
    this.initForm();
    this.loadCanchas();
    this.loadHorarios();
  }

  initForm(): void {
    this.horarioForm = this.fb.group({
      canchaDeportivaId: ['', Validators.required],
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      disponible: [true]
    });
  }

  loadCanchas(): void {
    this.canchaService.obtenerCanchasActivas().subscribe({
      next: (data) => {
        this.canchas = data;
      },
      error: (error) => {
        console.error('Error al cargar canchas:', error);
      }
    });
  }

  loadHorarios(): void {
    this.horarioService.obtenerTodosLosHorarios().subscribe({
      next: (data: horarioCancha[]) => {
        this.horarios = data;
      },
      error: (error: any) => {
        console.error('Error al cargar horarios:', error);
      }
    });
  }

  get filteredHorarios(): horarioCancha[] {
    return this.horarios.filter(h => {
      const matchCancha = !this.selectedCanchaFilter || h.canchaDeportiva.id === this.selectedCanchaFilter;
      const matchDia = !this.selectedDiaFilter || h.diaSemana === this.selectedDiaFilter;
      return matchCancha && matchDia;
    });
  }

  calcularDuracion(horaInicio: string, horaFin: string): string {
    const [horaI, minI] = horaInicio.split(':').map(Number);
    const [horaF, minF] = horaFin.split(':').map(Number);

    const minutosInicio = horaI * 60 + minI;
    const minutosFin = horaF * 60 + minF;
    const duracionMinutos = minutosFin - minutosInicio;

    const horas = Math.floor(duracionMinutos / 60);
    const minutos = duracionMinutos % 60;

    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}m`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}m`;
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedHorarioId = null;
    this.horarioForm.reset({ disponible: true });
    this.showModal = true;
  }

  openEditModal(horario: horarioCancha): void {
    this.isEditMode = true;
    this.selectedHorarioId = horario.id;
    this.horarioForm.patchValue({
      canchaDeportivaId: horario.canchaDeportiva.id,
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      disponible: horario.disponible
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.horarioForm.reset();
  }

  saveHorario(): void {
    if (this.horarioForm.invalid) {
      Object.keys(this.horarioForm.controls).forEach(key => {
        this.horarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    const horarioData = {
      ...this.horarioForm.value,
      canchaDeportiva: { id: this.horarioForm.value.canchaDeportivaId }
    };

    if (this.isEditMode && this.selectedHorarioId) {
      // Editar
      this.horarioService.actualizarHorario(this.selectedHorarioId, horarioData).subscribe({
        next: () => {
          this.loadHorarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar horario:', error);
          alert('Error al actualizar el horario');
        }
      });
    } else {
      // Crear
      this.horarioService.crearHorario(horarioData).subscribe({
        next: () => {
          this.loadHorarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear horario:', error);
          alert('Error al crear el horario');
        }
      });
    }
  }

  deleteHorario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este horario?')) {
      this.horarioService.eliminarHorario(id).subscribe({
        next: () => {
          this.loadHorarios();
        },
        error: (error) => {
          console.error('Error al eliminar horario:', error);
          alert('Error al eliminar el horario');
        }
      });
    }
  }

  getDisponibleClass(disponible: boolean): string {
    return disponible ? 'disponible-si' : 'disponible-no';
  }

  clearFilters(): void {
    this.selectedCanchaFilter = null;
    this.selectedDiaFilter = '';
  }
}
