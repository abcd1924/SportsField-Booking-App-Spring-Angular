# 🏟️ SportsField Booking App

A comprehensive system for managing and booking sports facilities. This application streamlines operations for sports complexes, managing schedules, reservations, staff, and billing, while providing tailored interfaces for Administrators, Receptionists, and Customers.

Built with a modern architecture using **Spring Boot 3** for the backend and **Angular 18** for the frontend.

---

## 🚀 Key Features

### 👤 User Module (Customer)
* **Field Discovery:** Visual catalog of available facilities with filtering and details.
* **Online Booking:** Intuitive flow to select dates, times, and confirm reservations.
* **Personal Management:** "My Reservations" dashboard to view history and status.
* **Profile:** Manage personal information and account security.

### 🛡️ Admin Module (Owner/Manager)
* **Analytics Dashboard:** Real-time statistics (Today's bookings, Revenue, New Users, Occupancy rates).
* **Infrastructure Management:** Full CRUD for sports fields (create, edit, pricing, images).
* **Staff Management:** Manage users and assign roles (promote to Receptionist).
* **Full Control:** Global access to all reservations, schedules, and billing.

### 📋 Receptionist Module (Staff)
* **Daily Operations:** Quick view of availability and today's schedule.
* **Booking Management:** Create on-site reservations, handle cancellations, and validate attendance.
* **Receipts:** Issue and download payment receipts (PDF) for customers.
* **Schedules:** Check availability per field.

---

## 🛠️ Tech Stack

### Backend (REST API)
* **Language:** Java 17
* **Framework:** Spring Boot 3.5.4
* **Security:** Spring Security 6 + JWT (JSON Web Tokens)
* **Database:** MySQL (with Spring Data JPA)
* **Utilities:**
    * **Apache PDFBox:** For dynamic PDF receipt generation.
    * **Lombok:** Boilerplate code reduction.
    * **Maven:** Dependency management.

### Frontend (Single Page Application)
* **Framework:** Angular 18 (Standalone Components)
* **Styling & UI:**
    * **TailwindCSS 4:** Modern and responsive utility-first styling.
    * **PrimeNG 18:** Rich UI components (Tables, Charts, Modals).
* **Architecture:**
    * **Guards:** Role-based route protection (`roleGuard`).
    * **Interceptors:** Automatic JWT token handling in HTTP requests.
    * **Services:** Reactive business logic using RxJS.

---

## 📂 Project Structure

The repository is organized as a monorepo with two main directories:
```text
/
├── backend/            # Java/Spring Boot source code
│   ├── src/main/java/reservaCanchasDeportivas/rcd/
│   │   ├── controller/ # REST Endpoints
│   │   ├── model/      # JPA Entities
│   │   ├── service/    # Business Logic
│   │   ├── security/   # JWT Configuration
│   │   └── ...
│   └── pom.xml         # Maven Dependencies
│
└── frontend/           # Angular source code
    ├── src/app/
    │   ├── pages/      # Views (Admin, User, Public, Auth)
    │   ├── services/   # API Communication
    │   ├── models/     # TypeScript Interfaces
    │   └── guards/     # Route Protection
    └── package.json    # NPM Dependencies
```
---

## ⚙️ Installation & Setup Guide

### Prerequisites
* Java JDK 17 or higher.
* Node.js v18+ and NPM.
* MySQL Server running.
* Maven (optional, wrapper included).

### 1. Backend Setup
1.  Navigate to the `backend` directory.
2.  Configure your database connection in `src/main/resources/application.properties`. You can use `application.properties-example` as a guide:
    ```properties
    spring.application.name=rcd
    spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name?createDatabaseIfNotExist=true
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    ```
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    *The server will start at `http://localhost:8080`.*

### 2. Frontend Setup
1.  Navigate to the `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    ng serve
    ```
4.  Open your browser at `http://localhost:4200`.

---

## 🔐 Roles & User Management

The system uses JWT-based authentication. Upon starting, ensure you have users with the following roles in your database to test all modules:

| Role | Description | Access |
| :--- | :--- | :--- |
| **ADMIN** | Owner/Administrator | Full access (`/admin/...`) |
| **RECEPCIONISTA** | Staff | Operational management (`/recepcionista/...`) |
| **USER** | Customer | Booking and profile (`/user/...`) |

> **Note:** You can create an initial user by registering via the web interface and then manually updating their role in the database to `ADMIN` or `RECEPCIONISTA`.

---

## 📄 License

This project is licensed under the MIT License.

Developed by Valentino Castro Olazábal- 2026.
