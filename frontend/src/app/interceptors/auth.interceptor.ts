import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);
  const login_endpoints = [
    '/api/auth/login',
    '/admin/login'
  ];
  // Verificar si es una request de login
  const isLoginRequest = login_endpoints.some(endpoint => req.url.includes(endpoint));

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          if (isLoginRequest) {
            console.log('Error de credenciales en login - dejando manejar el error al componente');
            return throwError(() => error)
          }
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    )
  }

  // Si no hay token, continúa con la request original
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        if (isLoginRequest) {
          console.log('Error de credenciales en login sin token - componente maneja el error');
          return throwError(() => error);
        }
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};