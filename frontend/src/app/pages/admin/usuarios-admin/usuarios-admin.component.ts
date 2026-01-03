import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.scss'
})
export class UsuariosAdminComponent implements OnInit {
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);

  usuarios: User[] = [];
  showModal = false;
  usuarioForm!: FormGroup;
  selectedUsuario: User | null = null;

  // Filtros
  selectedRolFilter: string = '';
  searchTerm: string = '';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Exponer Math para el template
  Math = Math;

  rolesDisponibles = ['ADMIN', 'RECEPCIONISTA', 'USER'];
  tiposDocumento = ['DNI', 'Carnet de Extranjería', 'Pasaporte'];
  generos = ['Masculino', 'Femenino', 'Otro'];

  ngOnInit(): void {
    this.initForm();
    this.loadUsuarios();
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numDocumento: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      rol: ['USER', Validators.required]
    });
  }

  loadUsuarios(): void {
    this.usersService.obtenerUsuarios().subscribe({
      next: (data: User[]) => {
        this.usuarios = data;
      },
      error: (error: any) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  get filteredUsuarios(): User[] {
    return this.usuarios.filter(u => {
      const matchRol = !this.selectedRolFilter || u.rol === this.selectedRolFilter;
      const matchSearch = !this.searchTerm ||
        u.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.numDocumento.includes(this.searchTerm);
      return matchRol && matchSearch;
    });
  }

  get paginatedUsuarios(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsuarios.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsuarios.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  openEditModal(usuario: User): void {
    this.selectedUsuario = usuario;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      tipoDocumento: usuario.tipoDocumento,
      numDocumento: usuario.numDocumento,
      fechaNacimiento: usuario.fechaNacimiento,
      genero: usuario.genero,
      rol: usuario.rol
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUsuario = null;
    this.usuarioForm.reset();
  }

  updateUsuario(): void {
    if (this.usuarioForm.invalid || !this.selectedUsuario) {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    const usuarioData = this.usuarioForm.value;
    const usuarioId = this.selectedUsuario.id!;

    this.usersService.actualizarUsuario(usuarioId, usuarioData).subscribe({
      next: () => {
        this.loadUsuarios();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error al actualizar usuario:', error);
        alert('Error al actualizar el usuario');
      }
    });
  }

  deleteUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.usersService.eliminarUsuario(id).subscribe({
        next: () => {
          this.loadUsuarios();
        },
        error: (error: any) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  getRolClass(rol: string): string {
    switch (rol) {
      case 'ADMIN':
        return 'rol-admin';
      case 'RECEPCIONISTA':
        return 'rol-recepcionista';
      case 'USER':
        return 'rol-user';
      default:
        return '';
    }
  }

  clearFilters(): void {
    this.selectedRolFilter = '';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
