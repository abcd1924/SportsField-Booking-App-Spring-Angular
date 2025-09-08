import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recepcionista-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './recepcionista-layout.component.html',
  styleUrl: './recepcionista-layout.component.scss'
})
export class RecepcionistaLayoutComponent {

}