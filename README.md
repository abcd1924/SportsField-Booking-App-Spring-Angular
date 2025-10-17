# Sistema de Reserva de Canchas Deportivas (Proyecto Full Stack)

![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-yellowgreen)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.4-blue?logo=spring-boot)
![Angular](https://img.shields.io/badge/Angular-18.2-red?logo=angular)
![Java](https://img.shields.io/badge/Java-17-orange?logo=java)

Aplicación web full stack para la gestión y reserva de canchas deportivas. Este proyecto personal fue desarrollado con el objetivo de aplicar y demostrar conocimientos en desarrollo backend con **Spring Boot** y desarrollo frontend con **Angular**.

> **Nota:** Este proyecto se encuentra actualmente en desarrollo. Algunas funcionalidades pueden estar incompletas o en proceso de mejora.

## Características Principales

El sistema está diseñado para atender a tres tipos de roles: `ADMIN`, `RECEPCIONISTA` y `USER`.

### Backend (API REST con Spring Boot)
* **Seguridad:** Autenticación y autorización basadas en roles utilizando **JWT (JSON Web Tokens)** y Spring Security.
* **Gestión de Usuarios:** Creación, consulta y actualización de usuarios con roles definidos.
* **Gestión de Canchas:** CRUD completo para administrar las canchas deportivas, incluyendo detalles como tipo, capacidad y precio.
* **Sistema de Reservas:**
    * Creación de **reservas temporales** que expiran si no se confirman.
    * Lógica para **confirmar y cancelar** reservas.
    * Validación de disponibilidad para **prevenir colisión de horarios**.
* **Generación de Comprobantes:** Creación automática de comprobantes en formato PDF para las reservas confirmadas.
* **Manejo de Errores:** Implementación de un `GlobalExceptionHandler` para gestionar y devolver errores de forma consistente.

### Frontend (SPA con Angular)
* **Diseño Responsivo:** Interfaz moderna desarrollada con **PrimeNG** y **Tailwind CSS**.
* **Sistema de Ruteo:**
    * Múltiples `Layouts` para las secciones pública, de usuario y de administrador.
    * **Guards de Rutas** para proteger el acceso según el rol del usuario.
* **Formularios Reactivos:** Formularios con validaciones personalizadas y en tiempo real para el registro y login de usuarios.
* **Comunicación con API:** Interceptores de HTTP para añadir automáticamente el token JWT a las peticiones.
* **Flujo de Reserva:** Proceso completo desde la selección de cancha y horario hasta la confirmación y visualización del comprobante.

## Tecnologías Utilizadas

| Área | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Backend** | Spring Boot | Framework principal para la API REST. |
| | Spring Security | Gestión de autenticación y autorización (JWT). |
| | Spring Data JPA | Acceso a datos y persistencia. |
| | MySQL | Base de datos relacional. |
| | Maven | Gestión de dependencias y construcción del proyecto. |
| | PDFBox | Generación de documentos PDF. |
| **Frontend**| Angular v18 | Framework principal para la Single Page Application (SPA). |
| | TypeScript | Lenguaje de programación principal. |
| | PrimeNG v18 | Biblioteca de componentes UI. |
| | Tailwind CSS v4.1 | Framework de CSS para estilos. |
| | RxJS | Programación reactiva para el manejo de eventos y datos asíncronos. |

## Cómo Empezar

Para ejecutar este proyecto en tu entorno local, sigue los siguientes pasos.

### Prerrequisitos
* Java 17 o superior.
* Maven 3.9 o superior.
* Node.js 18 o superior.
* Una instancia de base de datos MySQL.

### Backend
1.  Clona el repositorio.
2.  Navega a la carpeta `backend`.
3.  Renombra el archivo `application.properties-example` a `application.properties` y configura las credenciales de tu base de datos y el secreto de JWT.
4.  Ejecuta el proyecto con el comando:
    ```bash
    mvn spring-boot:run
    ```
5.  La API estará disponible en `http://localhost:8080`.

### Frontend
1.  Abre otra terminal y navega a la carpeta `frontend`.
2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo de Angular:
    ```bash
    ng serve
    ```
4.  La aplicación estará disponible en `http://localhost:4200`.

## Próximos Pasos (Roadmap)
- [ ] Implemetar diseño y lógica para el usuario.
- [ ] Desarrollar paneles de reportes para el administrador y recepcionista.
- [ ] Escribir tests unitarios (JUnit) y de integración para el backend.
- [ ] Añadir sistema de notificaciones por correo electrónico.
- [ ] Escribir tests E2E (Cypress/Playwright) para el frontend.
- [ ] Implementar pasarela de pagos en línea.
- [ ] Dockerizar la aplicación para un despliegue más sencillo.
