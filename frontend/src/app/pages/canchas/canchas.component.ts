import { Component, inject, OnInit } from '@angular/core';
import { CanchaDeportivaService } from '../../services/cancha-deportiva.service';
import { canchaDeportiva } from '../../models/canchaDeportiva';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface FiltroCancha {
  label: string;
  value: string;
}

@Component({
  selector: 'app-canchas',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, Message, Skeleton, Select, FormsModule],
  templateUrl: './canchas.component.html',
  styleUrl: './canchas.component.scss'
})
export class CanchasComponent implements OnInit {
  private canchaService = inject(CanchaDeportivaService);
  private router = inject(Router);

  canchas: canchaDeportiva[] = [];
  canchasFiltradas: canchaDeportiva[] = [];
  cargando = false;
  error = '';

  filtroTipoSeleccionado: string | null = null;
  filtroPrecioSeleccionado: number | null = null;
  textoBusqueda = '';

  tiposCanchaFiltro: FiltroCancha[] = [];
  preciosFiltro: FiltroCancha[] = [
    { label: 'Hasta S/50', value: '50' },
    { label: 'Hasta S/80', value: '80' },
    { label: 'Hasta S/100', value: '100' },
    { label: 'Hasta S/150', value: '150' }
  ]

  constructor() { }

  ngOnInit(): void {
    this.cargarCanchas();
  }

  private listarCanchas() {
    this.canchaService.obtenerCanchas().subscribe(dato => {
      this.canchas = dato;
    })
  }

  imagenes: { [key: string]: string } = {
    'futbol': 'assets/img/f11.png',
    'fútbol': 'assets/img/f11.png',
    'football': 'assets/img/f11.png',
    'futbol_11': 'assets/img/f11.png',
    'futbol_7': 'assets/img/f11.png',
    'futbol_5': 'assets/img/f11.png',

    'voley': 'assets/img/voley.png',
    'voleibol': 'assets/img/voley.png',
    'volleyball': 'assets/img/voley.png',
    'voleybol': 'assets/img/voley.png',

    'basket': 'assets/img/basket.png',
    'basquet': 'assets/img/basket.png',
    'basketball': 'assets/img/basket.png',
    'básquetbol': 'assets/img/basket.png',
    'basquetbol': 'assets/img/basket.png',

    'tenis': 'assets/img/tenis.png',
    'tennis': 'assets/img/tenis.png',
    'padel': 'assets/img/tenis.png',
    'paddle': 'assets/img/tenis.png'
  };

  getImagenCancha(tipoCancha: string): string {
    if (!tipoCancha) return 'assets/img/img-default.png';

    const tipoLower = tipoCancha.toLowerCase().trim();
    if (this.imagenes[tipoLower]) {
      return this.imagenes[tipoLower];
    }

    const claveEncontrada = Object.keys(this.imagenes).find(clave =>
      tipoLower.includes(clave) || clave.includes(tipoLower)
    );

    return claveEncontrada ? this.imagenes[claveEncontrada] : 'assets/img/img-default.png';
  }

  private cargarCanchas(): void {
    this.cargando = true;
    this.error = '';

    // Usar obtenerCanchasActivas() en lugar de obtenerCanchas() para mostrar solo las disponibles
    this.canchaService.obtenerCanchasActivas().subscribe({
      next: (canchas) => {
        this.canchas = canchas;
        this.canchasFiltradas = [...canchas];
        console.log('canchas:', canchas);
        console.log('canchasFiltradas:', this.canchasFiltradas);
        this.generarFiltrosTipoCancha();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar canchas:', err);
        this.error = 'No se pudieron cargar las canchas. Por favor, intenta nuevamente.';
        this.cargando = false;
      }
    });
  }

  private generarFiltrosTipoCancha(): void {
    const tiposUnicos = [...new Set(this.canchas.map(c => c.tipoCancha))];
    this.tiposCanchaFiltro = tiposUnicos.map(tipo => ({
      label: tipo,
      value: tipo
    }));
  }

  aplicarFiltros(): void {
    this.canchasFiltradas = this.canchas.filter(cancha => {
      if (this.filtroTipoSeleccionado && cancha.tipoCancha !== this.filtroTipoSeleccionado) {
        return false;
      }

      if (this.filtroPrecioSeleccionado && cancha.precioPorHora > this.filtroPrecioSeleccionado) {
        return false;
      }

      if (this.textoBusqueda.trim()) {
        const texto = this.textoBusqueda.toLowerCase().trim();
        const descripcion = (cancha.descripcion || '').toLowerCase();
        const tipo = cancha.tipoCancha.toLowerCase();
        const numero = cancha.numeroCancha.toLowerCase();

        if (!descripcion.includes(texto) && !tipo.includes(texto) && !numero.includes(texto)) {
          return false;
        }
      }

      return true;
    });
  }

  limpiarFiltros(): void {
    this.filtroTipoSeleccionado = null;
    this.filtroPrecioSeleccionado = null;
    this.textoBusqueda = '';
    this.canchasFiltradas = [...this.canchas];
  }

  tienesFiltrosActivos(): boolean {
    return !!(this.filtroTipoSeleccionado || this.filtroPrecioSeleccionado || this.textoBusqueda.trim());
  }

  verDetallesCancha(canchaId: number): void {
    this.router.navigate(['/canchas', canchaId]);
  }

  getIconoTipoCancha(tipoCancha: string): string {
    const tipo = tipoCancha.toLowerCase();

    if (tipo.includes('futbol') || tipo.includes('fútbol') || tipo.includes('football')) {
      return '⚽';
    }
    if (tipo.includes('voley') || tipo.includes('voleibol') || tipo.includes('volleyball')) {
      return '🏐';
    }
    if (tipo.includes('basket') || tipo.includes('basquet') || tipo.includes('basketball')) {
      return '🏀';
    }
    if (tipo.includes('tenis') || tipo.includes('tennis') || tipo.includes('padel')) {
      return '🎾';
    }

    return '🏟️';
  }

  getEstadoSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | undefined {
    const estadoMap: { [key: string]: 'success' | 'warn' | 'danger' | 'info' | 'secondary' } = {
      'DISPONIBLE': 'success',
      'ACTIVA': 'success',
      'OCUPADA': 'danger',
      'MANTENIMIENTO': 'warn',
      'INACTIVA': 'secondary'
    };

    return estadoMap[estado.toUpperCase()] || 'info';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/img/img-default.png';
  }

  trackByCanchaId(index: number, cancha: canchaDeportiva): number {
    return cancha.id;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}