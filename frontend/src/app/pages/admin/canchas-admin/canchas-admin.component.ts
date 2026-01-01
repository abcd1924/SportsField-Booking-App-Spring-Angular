import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanchaDeportivaService } from '../../../services/cancha-deportiva.service';
import { canchaDeportiva } from '../../../models/canchaDeportiva';

@Component({
  selector: 'app-canchas-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './canchas-admin.component.html',
  styleUrl: './canchas-admin.component.scss'
})
export class CanchasAdminComponent implements OnInit {
  private canchaService = inject(CanchaDeportivaService);
  private fb = inject(FormBuilder);

  canchas: canchaDeportiva[] = [];
  showModal = false;
  isEditMode = false;
  canchaForm!: FormGroup;
  selectedCanchaId: number | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadCanchas();
  }

  initForm(): void {
    this.canchaForm = this.fb.group({
      tipoCancha: ['', Validators.required],
      numeroCancha: ['', Validators.required],
      precioPorHora: [0, [Validators.required, Validators.min(0)]],
      capacidadJugadores: [0, [Validators.required, Validators.min(1)]],
      tipoGrass: ['', Validators.required],
      descripcion: [''],
      estado: ['ACTIVA', Validators.required],
      iluminacion: ['', Validators.required]
    });
  }

  loadCanchas(): void {
    this.canchaService.obtenerCanchas().subscribe({
      next: (data) => {
        this.canchas = data;
      },
      error: (error) => {
        console.error('Error al cargar canchas:', error);
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCanchaId = null;
    this.canchaForm.reset({
      estado: 'ACTIVA',
      precioPorHora: 0,
      capacidadJugadores: 0
    });
    this.showModal = true;
  }

  openEditModal(cancha: canchaDeportiva): void {
    this.isEditMode = true;
    this.selectedCanchaId = cancha.id;
    this.canchaForm.patchValue(cancha);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.canchaForm.reset();
  }

  saveCancha(): void {
    if (this.canchaForm.invalid) {
      Object.keys(this.canchaForm.controls).forEach(key => {
        this.canchaForm.get(key)?.markAsTouched();
      });
      return;
    }

    const canchaData = this.canchaForm.value;

    if (this.isEditMode && this.selectedCanchaId) {
      // Editar
      this.canchaService.actualizarCancha(this.selectedCanchaId, canchaData).subscribe({
        next: () => {
          this.loadCanchas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar cancha:', error);
          alert('Error al actualizar la cancha');
        }
      });
    } else {
      // Crear
      this.canchaService.crearCancha(canchaData).subscribe({
        next: () => {
          this.loadCanchas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear cancha:', error);
          alert('Error al crear la cancha');
        }
      });
    }
  }

  deleteCancha(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta cancha?')) {
      this.canchaService.eliminarCancha(id).subscribe({
        next: () => {
          this.loadCanchas();
        },
        error: (error) => {
          console.error('Error al eliminar cancha:', error);
          alert('Error al eliminar la cancha');
        }
      });
    }
  }

  getEstadoClass(estado: string): string {
    return estado === 'ACTIVA' ? 'estado-activa' : 'estado-inactiva';
  }
}
