import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent implements OnInit {
  isHomePage = false;
  isScrolled = false;
  isLoggedIn = false;
  userName: string | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomePage = event.url === '/' || event.url === '';
        this.updateAuthState();
      });

    this.isHomePage = this.router.url === '/' || this.router.url === '';
    this.updateAuthState();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  updateAuthState(): void {
    this.isLoggedIn = this.authService.isFullyAuthenticated();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.userName = user ? user.nombre : 'Usuario';
    } else {
      this.userName = null;
    }
  }
}