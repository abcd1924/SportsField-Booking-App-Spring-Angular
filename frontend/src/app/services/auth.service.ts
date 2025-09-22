import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { decodeToken } from '../models/decodeToken';
import { environment } from '../models/environment';
import { LoginSuccessResponse } from '../models/errorsLogin/loginSuccessResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'authToken';
  private userKey = 'currentUser';
  private userEmail: string | null = null;

  redirectUrl: string | null = null;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<LoginSuccessResponse> {
    return this.http.post<LoginSuccessResponse>(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  saveUser(user: any) {
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  getSavedUser(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userEmail = null;
    this.redirectUrl = null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';

    const payload = JSON.parse(atob(token.split('.')[1]));

    const authorities: string[] = payload.roles || payload.authorities;
    if (!authorities || authorities.length === 0) return '';

    return authorities[0].replace("ROLE_", "")
  }

  setUserEmail(email: string) {
    this.userEmail = email;
  }

  getUserInfo(): decodeToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<decodeToken>(token);
    } catch (e) {
      console.error("Error al codificar el token", e)
      return null;
    }
  }

  getUserEmail(): string | null {
    const decoded = this.getUserInfo();
    return decoded ? decoded.sub : null;
  }

  getCurrentUser(): decodeToken | null {
    return this.getUserInfo();
  }

  // Para Reserva Service
  getCurrentUserForReservations(): { id: number; nombre: string; email: string } | null {
    const savedUser = this.getSavedUser();
    if (savedUser && savedUser.id) {
      return {
        id: savedUser.id,
        nombre: savedUser.nombre,
        email: savedUser.email
      };
    }
    return null;
  }

  // Verifica si hay un usuario completamente autenticado
  isFullyAuthenticated(): boolean {
    const hasValidToken = this.isLoggedIn();
    const hasUserData = this.getSavedUser() !== null;
    return hasValidToken && hasUserData;
  }
}