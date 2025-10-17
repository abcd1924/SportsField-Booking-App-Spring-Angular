import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavigationRouteService } from '../../../services/navigation-route.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario: any = null;
  anioActual = new Date().getFullYear();

  logout(): void {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  navItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/user/dashboard'
    },
    {
      label: 'Mis Reservas',
      icon: 'pi pi-calendar',
      routerLink: '/user/mis-reservas'
    },
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      routerLink: '/user/perfil'
    }
  ];

  ngOnInit(): void {
    this.cargarUsuario();
  }

  private cargarUsuario(): void {
    this.usuario = this.authService.getSavedUser();
    if (!this.usuario) {
      this.router.navigate(['/login']);
    }
  }

  obtenerIniciales(nombre: string, apellido: string): string {
    if (!nombre || !apellido) return 'U';

    const inicial1 = nombre.charAt(0).toUpperCase();
    const inicial2 = apellido.charAt(0).toUpperCase();

    return `${inicial1}${inicial2}`;
  }
}