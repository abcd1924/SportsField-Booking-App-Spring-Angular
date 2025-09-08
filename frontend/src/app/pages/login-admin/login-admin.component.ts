import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.scss'
})
export class LoginAdminComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginAdminForm: FormGroup;
  user: User | null = null;

  cargando = false;
  mensajeError = '';

  constructor(private router: Router) {
    this.loginAdminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLoginAdmin() {
    this.mensajeError = '';

    if(this.loginAdminForm.invalid) {
      this.loginAdminForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    // Obtener credenciales del formulario
    const credenciales = {
      email: this.loginAdminForm.get('email')?.value,
      password: this.loginAdminForm.get('password')?.value
    };

    this.authService.login(credenciales).subscribe({
      next: (res) => {
        this.cargando = false;

        this.authService.saveToken(res.accessToken);

        if (res.user) {
          this.user = res.user;
          this.authService.saveUser(res.user);
        }

        console.log('Usuario autenticado: ', res.user);
        console.log('Rol del usuario: ', res.user?.rol);

        // Verificar que sea ADMIN o RECEPCIONISTA
        this.verificarRolYRedirigir(res.user?.rol);
      },

      error: (err) => {
        this.cargando = false;
        this.procesarErrorLogin(err);
      }
    })
  }

  // Método clave: Verifica el rol y redirige al dashboard apropiado - ADMIN y RECEPCIONISTA
  private verificarRolYRedirigir(rol: string): void {
    switch (rol) {
      case 'ADMIN':
        console.log('Redirigiendo a dashboard de admon');
        this.router.navigate(['/admin/dashboard']);
        break;
      
      case 'RECEPCIONISTA':
        console.log('Redirigiendo a dashboard de recepcionista');
        this.router.navigate(['/recepcionista/dashboard']);
        break;
      
      case 'USER':
        this.mensajeError = 'Acceso denegado. Este portal es solo para administradores y recepcionistas.';
        this.authService.logout();
        break;

      default:
        this.mensajeError = 'Rol de usuario no reconocido. Contacta al administrador del sistema.';
        this.authService.logout();
        break;
    }
  }

  // Método similar al de login de usuarios
  private procesarErrorLogin(error: any): void {
    console.error('Error en login admin: ', error);

    const errorResponse = error.error || error;

    if (errorResponse && errorResponse.message) {
      this.mensajeError = errorResponse.message;
    } else {
      this.mensajeError = 'Error al iniciar sesión. Verifica tus credenciales e intenta nuevamente.';
    }
  }

  // Métodos de validación
  tieneError(campo: string): boolean {
    const control = this.loginAdminForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obtenerMensajeError(campo: string): string {
    const control = this.loginAdminForm.get(campo);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es requerido';
    if (errors['email']) return 'Ingrese un email válido';

    return 'Campo inválido';
  }
}