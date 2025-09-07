import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  user: User | null = null;

  cargando = false; // Indicador de carga
  mensajeError = '';

  constructor(private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onLogin() {
    this.mensajeError = ''; // Limpiar mensaje de error

    // Verificar que el form sea válido
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const credenciales = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(credenciales).subscribe({
      next: (res) => {
        this.cargando = false;

        this.authService.saveToken(res.accessToken);
        console.log('Token guardado:', res.accessToken);
        this.authService.setUserEmail(credenciales.email); // Se guarda el email en memoria

        // Guarda datos del usuario
        if (res.user) {
          this.authService.saveUser(res.user);
        }

        if (this.authService.redirectUrl) {
          console.log("Redirigiendo a redirectUrl:", this.authService.redirectUrl);
          this.router.navigateByUrl(this.authService.redirectUrl);
          this.authService.redirectUrl = null;
        } else {
          console.log("Redirigiendo a perfil con email:", credenciales.email);
          this.router.navigate(['user', 'perfil']);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.procesarErrorLogin(err);
      }
    });
  }

  private procesarErrorLogin(error: any): void {
    console.log('Error de login: ', error);

    const errorResponse = error.error || error;

    // Mostramos el mensaje específico del backend
    if (errorResponse && errorResponse.message) {
      this.mensajeError = errorResponse.message;
    } else {
      // Mensaje genérico si no hay uno específico
      this.mensajeError = 'Error al iniciar sesión. Por favor, intenta nuevamente';
    }
  }

  // Verifica si un campo específico tiene errores
  tieneError(campo: string): boolean {
    const control = this.loginForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Obtiene el mensaje de error para un campo específico
  obtenerMensajeError(campo: string): string {
    const control = this.loginForm.get(campo);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Ingrese un email válido';

    return 'Campo inválido';
  }
}