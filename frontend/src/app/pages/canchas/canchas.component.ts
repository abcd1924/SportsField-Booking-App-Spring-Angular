import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CanchaDeportivaService } from '../../services/cancha-deportiva.service';
import { canchaDeportiva } from '../../models/canchaDeportiva';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-canchas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canchas.component.html',
  styleUrl: './canchas.component.scss'
})
export class CanchasComponent implements OnInit{

  canchas: canchaDeportiva[] = [];

  constructor(private canchaService: CanchaDeportivaService) {}

  ngOnInit(): void {
      this.listarCanchas();
  }

  private listarCanchas() {
    this.canchaService.obtenerCanchas().subscribe( dato => {
      this.canchas = dato;
    })
  }
}