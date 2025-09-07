import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

interface NavigationRoute {
  label: string;
  icon: string;
  routerLink: string;
  badge?: string;
  badgeClass?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationRouteService {
  private router = inject(Router);
  private authService = inject(AuthService);

  redirectToRoleDashboard(): void {
    const userRole = this.authService.getUserRole();

    const dashboardRoutes = {
      'ADMIN': '/admin/dashboard',
      'RECEPCIONISTA': '/recepcionista/dashboard',
      'USER': '/user/dashboard'
    } as const;

    const route = dashboardRoutes[userRole as keyof typeof dashboardRoutes];
    this.router.navigate([route || '/']);
  }

  getNavigationRoutes(): NavigationRoute[] {
    const userRole = this.authService.getUserRole();

    const routesByRole = {
      'ADMIN': this.getAdminRoutes(),
      'RECEPCIONISTA': this.getRecepcionistaRoutes(),
      'USER': this.getUserRoutes()
    } as const;

    return routesByRole[userRole as keyof typeof routesByRole] || [];
  }

  private getAdminRoutes(): NavigationRoute[] {
    return [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/admin/dashboard'
      },
      {
        label: 'Canchas Deportivas',
        icon: 'pi pi-map',
        routerLink: '/admin/canchas'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: '/admin/usuarios'
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-line',
        routerLink: '/admin/reportes'
      }
    ];
  }

  private getRecepcionistaRoutes(): NavigationRoute[] {
    return [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/recepcionista/dashboard'
      },
      {
        label: 'Reservas',
        icon: 'pi pi-calendar',
        routerLink: '/recepcionista/reservas'
      },
      {
        label: 'Horarios',
        icon: 'pi pi-clock',
        routerLink: '/recepcionista/horarios'
      },
      {
        label: 'Comprobantes',
        icon: 'pi pi-file',
        routerLink: '/recepcionista/comprobantes'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: '/recepcionista/usuarios'
      }
    ];
  }

  private getUserRoutes(): NavigationRoute[] {
    return [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/user/dashboard'
      },
      {
        label: 'Nueva Reserva',
        icon: 'pi pi-plus',
        routerLink: '/user/nueva-reserva'
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
  }

  // Verifica si el usuario tiene acceso a una ruta específica
  canAccessRoute(requiredRoles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return requiredRoles.includes(userRole);
  }

  // Obtiene el título de la página actual basado en la ruta
  getPageTitle(route: string): string {
    const titleMap: Record<string, string> = {
      // Admin routes
      '/admin/dashboard': 'Panel de Administración',
      '/admin/canchas': 'Gestión de canchas',
      '/admin/usuarios': 'Gestión de usuarios',
      '/admin/reportes': 'Reportes y Estadísticas',

      // Recepcionista routes
      '/recepcionista/dashboard': 'Panel de Recepción',
      '/recepcionista/resercas': 'Gestión de Reservas',
      '/recepcionista/horarios': 'Gestión de horarios',
      '/recepcionista/comprobantes': 'Comprobantes',
      '/recepcionista/usuarios': 'Consulta de Usuarios',

      // User routes
      '/user/dashboard': 'Mi Panel',
      '/user/nueva-reserva': 'Nueva Reserva',
      '/user/mis-reservas': 'Mis Reservas',
      '/user/perfil': 'Mi Perfil'
    };

    return titleMap[route] || 'Sistema de Reservas'
  }
  constructor() { }
}
