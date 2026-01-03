import { CanActivateFn, Router, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { PublicLayoutComponent } from './pages/layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CanchasComponent } from './pages/canchas/canchas.component';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DashboardAdminComponent } from './pages/admin/dashboard-admin/dashboard-admin.component';
import { CanchasAdminComponent } from './pages/admin/canchas-admin/canchas-admin.component';
import { UsuariosAdminComponent } from './pages/admin/usuarios-admin/usuarios-admin.component';
import { RecepcionistaLayoutComponent } from './pages/layouts/recepcionista-layout/recepcionista-layout.component';
import { DashboardRecepcionistaComponent } from './pages/recepcionista/dashboard-recepcionista/dashboard-recepcionista.component';
import { ReservasRecepcionistaComponent } from './pages/recepcionista/reservas-recepcionista/reservas-recepcionista.component';
import { HorariosRecepcionistaComponent } from './pages/recepcionista/horarios-recepcionista/horarios-recepcionista.component';
import { ComprobantesRecepcionistaComponent } from './pages/recepcionista/comprobantes-recepcionista/comprobantes-recepcionista.component';
import { UserLayoutComponent } from './pages/layouts/user-layout/user-layout.component';
import { DashboardUserComponent } from './pages/user/dashboard-user/dashboard-user.component';
import { MisReservasComponent } from './pages/user/mis-reservas/mis-reservas.component';
import { PerfilUserComponent } from './pages/user/perfil-user/perfil-user.component';
import { UnauthorizedComponent } from './pages/error/unauthorized/unauthorized.component';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { LoginAdminComponent } from './pages/login-admin/login-admin.component';
import { CanchasDetalleComponent } from './pages/canchas-detalle/canchas-detalle.component';
import { ReservaConfirmarComponent } from './pages/reserva-confirmar/reserva-confirmar.component';
import { ComprobanteComponent } from './pages/comprobante/comprobante.component';

export const roleGuard = (expectedRoles: string[]): CanActivateFn => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const savedUser = authService.getSavedUser();

        if (!savedUser || !savedUser.rol) {
            authService.redirectUrl = state.url;
            router.navigate(['/login']);
            return false;
        }

        const userRole = savedUser.rol;

        if (expectedRoles.includes(userRole)) {
            return true;
        }

        // Redireccionar según rol
        switch (userRole) {
            case 'ADMIN':
                router.navigate(['/admin/dashboard']);
                break;
            case 'RECEPCIONISTA':
                router.navigate(['/recepcionista/dashboard']);
                break;
            case 'USER':
                router.navigate(['/user/dashboard']);
                break;
            default:
                router.navigate(['/unauthorized']);
        }
        return false;
    };
};

export const routes: Routes = [

    // Rutas públicas
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'canchas', component: CanchasComponent },
            { path: 'canchas/:id', component: CanchasDetalleComponent }
        ]
    },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin/login', component: LoginAdminComponent },

    // RESERVA
    {
        path: 'reserva',
        children: [
            {
                path: 'confirmar/:reservaId',
                component: ReservaConfirmarComponent,
                canActivate: [authGuard]
            },
            {
                path: 'comprobante/:comprobanteId',
                component: ComprobanteComponent,
                canActivate: [authGuard]
            }
        ]
    },

    // Rutas de ADMIN
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardAdminComponent },
            { path: 'canchas', component: CanchasAdminComponent },
            { path: 'horarios', component: HorariosRecepcionistaComponent },
            { path: 'reservas', component: ReservasRecepcionistaComponent },
            { path: 'comprobantes', component: ComprobantesRecepcionistaComponent },
            { path: 'usuarios', component: UsuariosAdminComponent },
        ]
    },

    // Rutas de RECEPCIONISTA
    {
        path: 'recepcionista',
        component: RecepcionistaLayoutComponent,
        canActivate: [authGuard, roleGuard(['RECEPCIONISTA'])],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardRecepcionistaComponent },
            { path: 'reservas', component: ReservasRecepcionistaComponent },
            { path: 'horarios', component: HorariosRecepcionistaComponent },
            { path: 'comprobantes', component: ComprobantesRecepcionistaComponent },
            { path: 'usuarios', component: UsuariosAdminComponent }
        ]
    },

    // Rutas de USER
    {
        path: 'user',
        component: UserLayoutComponent,
        canActivate: [authGuard, roleGuard(['USER'])],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardUserComponent },

            // Reservas del usuarios
            { path: 'mis-reservas', component: MisReservasComponent },

            // Perfil (USER y ADMIN pueden editar)
            { path: 'perfil', component: PerfilUserComponent }
        ]
    },

    // Rutas de error
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '404', component: NotFoundComponent },

    // Wildcard route
    { path: '**', redirectTo: '/404' }
];