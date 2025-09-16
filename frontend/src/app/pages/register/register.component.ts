import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ErrorResponse } from '../../models/errorsRegister/errorResponse';
import { SuccessResponse } from '../../models/errorsRegister/successResponse';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ProgressSpinner, DatePicker, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroFormReactivo: FormGroup;
  private subscriptions = new Subscription();

  // Variables para manejar errores del backend
  cargando = false;
  mensajeExito = '';
  mensajeErrorGeneral = '';
  erroresDelServidor: { [key: string]: string } = {};

  // Opciones para los selects
  tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'Carnet_Extranjeria', label: 'Carné de extranjería' },
    { value: 'Pasaporte', label: 'Pasaporte' }
  ]

  generos = [
    { value: 'Maculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' }
  ]

  constructor(private userService: UsersService, private fb: FormBuilder, private router: Router) {

    // Inicializando el formulario
    this.registroFormReactivo = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        tipoDocumento: ['', [Validators.required]],
        numDocumento: ['', [Validators.required, this.documentoValidator.bind(this)]],
        fechaNacimiento: ['', [Validators.required, this.mayorDeEdadValidator]],
        telefono: ['', [Validators.required, this.telefonoValidator]],
        genero: ['', [Validators.required]],
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/)
        ]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordsIgualesValidator
      }
    )
  }

  ngOnInit(): void {
    // Escuchar cambios en el tipo de documento para revalidar el número
    const tipoDocumentoSub = this.registroFormReactivo.get('tipoDocumento')?.valueChanges.subscribe(() => {
      // Cuando cambia el tipo de documento, revalidamos el número de documento
      const numDocumentoControl = this.registroFormReactivo.get('numDocumento');
      if (numDocumentoControl) {
        numDocumentoControl.updateValueAndValidity();
      }
    });

    if (tipoDocumentoSub) {
      this.subscriptions.add(tipoDocumentoSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Limpiamos las subscripciones para evitar memory leaks
  }

  registrar(): void {
    this.limpiarMensajes();

    if (this.registroFormReactivo.invalid) {
      this.mensajeErrorGeneral = 'Por favor, corrige los errores en el formulario antes de continuar.';
      this.registroFormReactivo.markAllAsTouched();
      return;
    }

    // Hasta aquí, el form pasó las validaciones del frontend
    this.cargando = true;

    // Preparamos los datos para enviar al backend
    const datosUsuario = {
      ...this.registroFormReactivo.value, rol: 'USER'
    };
    delete datosUsuario.confirmPassword;

    // Enviamos la petición al backend
    this.userService.registrar(datosUsuario).subscribe({
      next: (response: SuccessResponse) => {
        // El usuario se registró correctamente
        this.cargando = false;
        this.mensajeExito = response.message || 'Usuario registrado exitosamente';
        this.router.navigate(['/login']);
      },

      error: (error) => {
        this.cargando = false;
        this.procesarErrorDelBackend(error);
      }
    });
  }

  // Validador para número de documento según el tipo
  private documentoValidator(control: AbstractControl): ValidationErrors | null {
    const tipoDocumento = this.registroFormReactivo?.get('tipoDocumento')?.value;
    const numDocumento = control.value;

    if (!numDocumento || !tipoDocumento) {
      return null; // Si no hay valor, lo maneja el required
    }

    switch (tipoDocumento) {
      case 'DNI': // Debe tener 8 dígitos
        if (!/^\d{8}$/.test(numDocumento)) {
          return {
            documentoInvalido: {
              message: 'El DNI debe tener 8 dígitos'
            }
          };
        }
        break;

      case 'Carnet_Extranjeria': // 9-12 caracteres alfanuméricos
        if (!/^[A-Z0-9]{9,12}$/i.test(numDocumento)) {
          return {
            documentoInvalido: {
              message: 'El carné de extranjería debe tener entre 9-12 caracteres alfanuméricos'
            }
          };
        }
        break;

      case 'Pasaporte': // 6-9 caracteres alfanuméricos
        if (!/^[A-Z0-9]{6,9}$/i.test(numDocumento)) {
          return {
            documentoInvalido: {
              message: 'El pasaporte debe tener entre 6-9 caracteres alfanuméricos'
            }
          };
        }
        break;
    }
    return null; // Válido
  }

  // Validador: teléfono debe tener 9 dígitos
  private telefonoValidator(control: AbstractControl): ValidationErrors | null {
    const telefono = control.value;

    if (!telefono) {
      return null;
    }

    if (!/^9\d{8}$/.test(telefono)) {
      return {
        telefonoInvalido: {
          message: 'El telefono debe tener 9 dígitos y empezar con 9'
        }
      };
    }

    return null;
  }

  // Validador: confirmar contraseña
  private passwordsIgualesValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNoCoinciden: true };
  }

  // Validador: mayor de 18 años
  private mayorDeEdadValidator(control: AbstractControl): ValidationErrors | null {
    const fechaNacimiento = new Date(control.value);
    if (isNaN(fechaNacimiento.getTime())) return null; // si no hay fecha, dejar que otro validador (required) avise

    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaNacimiento = fechaNacimiento.getDate();

    let edadReal = edad;
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edadReal--;
    }

    if (edadReal < 18) {
      return { menorDeEdad: { message: 'Debe ser mayor de 18 años ' } };
    }

    return null;
  }

  // Métodos de ayuda

  // Procesa las respuestas de error del backend y las convierte en mensajes visibles para el usuario
  private procesarErrorDelBackend(error: any): void {
    console.log('Error completo del backend: ', error);

    const errorResponse: ErrorResponse = error.error || error;

    if (errorResponse.fieldErrors && errorResponse.fieldErrors.length > 0) {
      errorResponse.fieldErrors.forEach(fieldError => {
        this.erroresDelServidor[fieldError.field] = fieldError.message;
        const control = this.registroFormReactivo.get(fieldError.field);
        if (control) {
          control.setErrors({ ...control.errors, servidor: fieldError.message });
          control.markAsTouched();
        }
      });
      this.mensajeErrorGeneral = errorResponse.message || 'Se encontraron errores en algunos campos. Por favor, revisa la información ingresada.';
    } else {
      this.mensajeErrorGeneral = errorResponse.message || 'Ha ocurrido un error al registrar el usuario. Por favor, intenta nuevamente.';
    }
  }

  // Limpia todos los mesajes de error y éxito anteriores
  private limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeErrorGeneral = '';
    this.erroresDelServidor = {};

    Object.keys(this.registroFormReactivo.controls).forEach(key => {
      const control = this.registroFormReactivo.get(key);
      if (control && control.errors && control.errors['servidor']) {
        delete control.errors['servidor'];
        if (Object.keys(control.errors).length === 0) {
          control.setErrors(null);
        }
      }
    })
  }

  // Verifica si las contraseñas no coinciden
  passwordsNoCoinciden(): boolean {
    return !!(this.registroFormReactivo.errors?.['passwordsNoCoinciden'] &&
      this.registroFormReactivo.get('confirmPassword')?.touched);
  }

  // Verifica si un campo específico tiene errores
  tieneError(campo: string): boolean {
    const control = this.registroFormReactivo.get(campo);

    const tieneErrorFrontend = control && control.invalid && (control.dirty || control.touched);

    const tieneErrorBackend = this.erroresDelServidor[campo];

    return tieneErrorFrontend || !!tieneErrorBackend;
  }

  // Obtiene el mensaje de error para un campo especifico
  obtenerMensajeError(campo: string): string {
    const control = this.registroFormReactivo.get(campo);

    if (!control || !control.errors) {
      return '';
    }

    const errores = control.errors;

    if (errores['required']) return `${this.obtenerNombreCampo(campo)} es requerido`;
    if (errores['email']) return 'Ingrese un email válido';
    if (errores['minlength']) return `${this.obtenerNombreCampo(campo)} debe tener al menos ${errores['minlength'].requiredLength} caracteres`;
    if (errores['pattern']) return 'La contraseña debe tener al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
    if (errores['menorDeEdad']) return errores['menorDeEdad'].message;
    if (errores['documentoInvalido']) return errores['documentoInvalido'].message;
    if (errores['telefonoInvalido']) return errores['telefonoInvalido'].message;

    return 'Campo Invalido';
  }

  // Convierte el nombre técnico del campo a nombre amigable
  private obtenerNombreCampo(campo: string): string {
    const nombres: { [key: string]: string } = {
      nombre: 'El nombre',
      apellido: 'El apellido',
      email: 'El email',
      tipoDocumento: 'El tipo de documento',
      numDocumento: 'El número de documento',
      fechaNacimiento: 'La fecha de nacimiento',
      telefono: 'El teléfono',
      genero: 'El género',
      password: 'La contraseña',
      confirmPassword: 'La confirmación de contraseña'
    };
    return nombres[campo] || campo;
  }

  // Obtiene el placeholder apropiado según el tipo de documento
  getPlaceholderDocumento(): string {
    const tipoDoc = this.registroFormReactivo.get('tipoDocumento')?.value;
    switch (tipoDoc) {
      case 'DNI':
        return '12345678';
      case 'Carnet_Extranjeria':
        return 'CE123456789';
      case 'Pasaporte':
        return 'AB123456';
      default:
        return 'Selecciona el tipo de documento'
    }
  }

  // Método para acceder fácil a los controles desde el HTML
  get f() {
    return this.registroFormReactivo.controls;
  }
}