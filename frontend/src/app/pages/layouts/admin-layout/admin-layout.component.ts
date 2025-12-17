import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavigationRouteService } from '../../../services/navigation-route.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationRouteService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);
  isMobileMenuOpen = signal(false);

  get adminName(): string {
    const user = this.authService.getCurrentUserForReservations();
    return user?.nombre || 'Admin';
  }

  toggleSidebar(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeSidebar(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}

