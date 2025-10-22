import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-perfil-user',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, InputTextModule, SelectModule, ProgressSpinnerModule, MessageModule, ReactiveFormsModule],
  templateUrl: './perfil-user.component.html',
  styleUrl: './perfil-user.component.scss'
})
export class PerfilUserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  user: any = null;
  modoEdicion = false;
  cargando = false;
  guardando = false;
  mensaje = '';
  mensajeTipo: 'success' | 'error' | '' = '';

  perfilForm: FormGroup;

  constructor() {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      genero: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  private cargarUsuario(): void {
    this.cargando = true;

    const usuarioGuardado = this.authService.getSavedUser();

    if (!usuarioGuardado || !usuarioGuardado.email) {
      this.mensaje = 'No se pudo cargar el perfil';
      this.mensajeTipo = 'error';
      this.cargando = false;
      return;
    }

    this.usersService.buscarPorEmail(usuarioGuardado.email).subscribe({
      next: (usuario) => {
        this.user = usuario;
        this.cargarDatosEnFormulario();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuario: ', err);
        this.user = usuarioGuardado;

        this.cargando = false;
      }
    });
  }

  private cargarDatosEnFormulario(): void {
    if (!this.user) return;

    this.perfilForm.patchValue({
      nombre: this.user.nombre || '',
      apellido: this.user.apellido || '',
      telefono: this.user.telefono || '',
      genero: this.user.genero || ''
    });
  }

  activarEdicion(): void {
    this.modoEdicion = true;
    this.mensaje = '';
    this.mensajeTipo = '';
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.cargarDatosEnFormulario();
    this.mensaje = '';
    this.mensajeTipo = '';
  }

  guardarCambios(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      this.mensaje = 'Por favor complete todos los campos correctamente';
      this.mensajeTipo = 'error';
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    const datosActualizados = {
      nombre: this.perfilForm.value.nombre,
      apellido: this.perfilForm.value.apellido,
      telefono: this.perfilForm.value.telefono,
      genero: this.perfilForm.value.genero,
    };

    this.usersService.actualizarUsuario(this.user.id, datosActualizados).subscribe({
      next: (usuarioActualizado) => {
        this.user = usuarioActualizado;

        this.authService.saveUser(usuarioActualizado);

        this.modoEdicion = false;
        this.guardando = false;

        this.mensaje = '¡Perfil actualizado exitosamente!';
        this.mensajeTipo = 'success';

        setTimeout(() => {
          this.mensaje = '';
          this.mensajeTipo = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.guardando = false;
        this.mensaje = 'Error al actualizar el perfil. Intente nuevamente.';
        this.mensajeTipo = 'error';
      }
    });
  }

  tieneError(campo: string): boolean {
    const control = this.perfilForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obtenerMensajeError(campo: string): string {
    const control = this.perfilForm.get(campo);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['pattern']) {
      if (campo === 'telefono') return 'Debe tener 9 dígitos';
      if (campo === 'numDocumento') return 'Debe tener 8 dígitos';
    }

    return 'Campo inválido';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No especificado';

    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calcularEdad(): number {
    if (!this.user?.fechaNacimiento) return 0;

    const hoy = new Date();
    const nacimiento = new Date(this.user.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  get inicialesUsuario(): string {
    if (!this.user) return 'U';

    const inicial1 = this.user.nombre?.charAt(0).toUpperCase() || '';
    const inicial2 = this.user.apellido?.charAt(0).toUpperCase() || '';

    return `${inicial1}${inicial2}` || 'U';
  }
}