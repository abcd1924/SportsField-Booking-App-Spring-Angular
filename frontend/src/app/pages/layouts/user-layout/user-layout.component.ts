import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavigationRouteService } from '../../../services/navigation-route.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  private authService = inject(AuthService);
  private navService = inject(NavigationRouteService);

  currentUser = signal(this.authService.getUserEmail());
  navItems = this.navService.getNavigationRoutes();

  logout(): void {
    this.authService.logout();
  }
}
