import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, DividerModule, TagModule, RouterLink, StyleClassModule], 
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss' 
})
export class HomeComponent{
  
}