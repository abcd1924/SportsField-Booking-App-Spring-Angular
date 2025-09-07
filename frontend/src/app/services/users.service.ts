import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../models/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  registrar(usuario: any): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/registrar`, usuario);
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  actualizarUsuario(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar/${id}`, user);
  }

  buscarPorEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar/email/${email}`);
  }

  existePorDocumento(numDocumento: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/existe/documento/${numDocumento}`);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}