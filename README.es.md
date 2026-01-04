# 🏟️ SportsField Booking App

Sistema integral de gestión y reserva de canchas deportivas. Esta aplicación permite administrar complejos deportivos, gestionar horarios, reservas, personal y facturación, ofreciendo interfaces específicas para Administradores, Recepcionistas y Clientes finales.

Desarrollado con una arquitectura moderna utilizando **Spring Boot 3** para el backend y **Angular 18** para el frontend.

---

## 🚀 Características Principales

### 👤 Módulo de Usuario (Cliente)
* **Exploración de Canchas:** Catálogo visual de instalaciones disponibles con filtrado y detalles.
* **Reservas en Línea:** Flujo intuitivo para seleccionar fecha, hora y confirmar reservas.
* **Gestión Personal:** Panel de control ("Mis Reservas") para consultar historial y estado.
* **Perfil:** Gestión de información personal y seguridad de la cuenta.

### 🛡️ Módulo de Administrador (Dueño/Gerente)
* **Dashboard Analítico:** Estadísticas en tiempo real (Reservas del día, Ingresos, Nuevos Usuarios, Ocupación).
* **Gestión de Infraestructura:** CRUD completo de canchas deportivas (creación, edición, precios, imágenes).
* **Gestión de Personal:** Administración de usuarios y asignación de roles (ascenso a Recepcionistas).
* **Control Total:** Acceso global a reservas, horarios y facturación.
* **Reportes:** Visualización de métricas de rendimiento del negocio.

### 📋 Módulo de Recepcionista (Staff)
* **Operativa Diaria:** Vista rápida de disponibilidad y reservas del día.
* **Gestión de Reservas:** Creación de reservas presenciales, cancelaciones y validación de asistencia.
* **Comprobantes:** Emisión y descarga de comprobantes de pago (PDF) para los clientes.
* **Horarios:** Consulta de disponibilidad por cancha.

---

## 🛠️ Stack Tecnológico

### Backend (API REST)
* **Lenguaje:** Java 17
* **Framework:** Spring Boot 3.5.4
* **Seguridad:** Spring Security 6 + JWT (JSON Web Tokens)
* **Base de Datos:** MySQL (con Spring Data JPA)
* **Utilidades:**
    * **Apache PDFBox:** Para la generación dinámica de comprobantes en PDF.
    * **Lombok:** Para reducción de código repetitivo.
    * **Maven:** Gestión de dependencias.

### Frontend (Single Page Application)
* **Framework:** Angular 18 (Standalone Components)
* **Estilos & UI:**
    * **TailwindCSS 4:** Estilizado moderno y responsivo.
    * **PrimeNG 18:** Componentes de interfaz ricos (Tablas, Gráficos, Modales).
* **Arquitectura:**
    * **Guards:** Protección de rutas por roles (`roleGuard`).
    * **Interceptors:** Manejo automático de tokens JWT en peticiones HTTP.
    * **Services:** Lógica de negocio reactiva con RxJS.

---

## 📂 Estructura del Proyecto

El repositorio está organizado como un monorepo con dos directorios principales:
```text
/
├── backend/            # Código fuente Java/Spring Boot
│   ├── src/main/java/reservaCanchasDeportivas/rcd/
│   │   ├── controller/ # Endpoints REST
│   │   ├── model/      # Entidades JPA
│   │   ├── service/    # Lógica de negocio
│   │   ├── security/   # Configuración JWT
│   │   └── ...
│   └── pom.xml         # Dependencias Maven
│
└── frontend/           # Código fuente Angular
    ├── src/app/
    │   ├── pages/      # Vistas (Admin, User, Public, Auth)
    │   ├── services/   # Comunicación con API
    │   ├── models/     # Interfaces TypeScript
    │   └── guards/     # Protección de rutas
    └── package.json    # Dependencias NPM
```
---

## ⚙️ Guía de Instalación y Ejecución

### Prerrequisitos
* Java JDK 17 o superior.
* Node.js v18+ y NPM.
* MySQL Server ejecutándose.
* Maven (opcional, incluido vía wrapper).

### 1. Configuración del Backend
1.  Navega al directorio `backend`.
2.  Configura la conexión a base de datos en `src/main/resources/application.properties`. Puedes usar `application.properties-example` como guía:
    ```properties
    spring.application.name=rcd
    spring.datasource.url=jdbc:mysql://localhost:3306/nombre_tu_bd?createDatabaseIfNotExist=true
    spring.datasource.username=tu_usuario
    spring.datasource.password=tu_contraseña
    spring.jpa.hibernate.ddl-auto=update
    ```
3.  Ejecuta la aplicación:
    ```bash
    ./mvnw spring-boot:run
    ```
    *El servidor iniciará en `http://localhost:8080`.*

### 2. Configuración del Frontend
1.  Navega al directorio `frontend`.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    ng serve
    ```
4.  Abre tu navegador en `http://localhost:4200`.

---

## 🔐 Gestión de Roles y Usuarios

El sistema utiliza autenticación basada en JWT. Al iniciar, asegúrate de tener usuarios con los siguientes roles en tu base de datos para probar todos los módulos:

| Rol | Descripción | Acceso |
| :--- | :--- | :--- |
| **ADMIN** | Dueño/Administrador | Acceso total (`/admin/...`) |
| **RECEPCIONISTA** | Personal del local | Gestión operativa (`/recepcionista/...`) |
| **USER** | Cliente final | Reserva y perfil (`/user/...`) |

> **Nota:** Puedes crear un usuario inicial registrándote desde la web y luego cambiando su rol manualmente en la base de datos a `ADMIN` o `RECEPCIONISTA`.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
Desarrollado por Valentino Castro Olazábal - 2026.
