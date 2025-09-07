import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { decodeToken } from '../../../models/decodeToken';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-user.component.html',
  styleUrl: './perfil-user.component.scss'
})
export class PerfilUserComponent implements OnInit {

  user: decodeToken | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    console.log("Usuario desde el token: ", this.user);
  }

    logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}