import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
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

  sidebarCollapsed = signal(false);
  
}