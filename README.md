# 🛡️ Vigitecol HR Management System

Sistema web para la gestión integral del talento humano en empresas de seguridad privada.

Web-based Human Resources Management System for private security companies.

---
## 🚀 Technologies | Tecnologías

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens)
![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven)
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-UI-FF69B4?style=for-the-badge)

## 📖 About the Project | Acerca del Proyecto

**🇪🇸 Español**

**Vigitecol HR Management System** es una aplicación web desarrollada para optimizar la gestión del talento humano en empresas de seguridad privada. Centraliza la administración de empleados, contratos, documentos, afiliaciones, estudios, cursos, **periodos de prueba**, **contratos por vencer** y usuarios mediante una arquitectura moderna basada en **Spring Boot**, **React** y **MySQL**, ofreciendo una interfaz intuitiva, seguridad mediante JWT y control de acceso por roles.

**🇺🇸 English**

**Vigitecol HR Management System** is a web application designed to streamline Human Resources management for private security companies. It centralizes employee records, contracts, documents, affiliations, education, training, **probation period monitoring**, **expiring contracts**, and user administration through a modern architecture based on **Spring Boot**, **React**, and **MySQL**, providing an intuitive interface, JWT security, and role-based access control.

## ✨ Features | Características Principales

- 👨‍💼 Employee Management | Gestión completa de empleados.
- 📄 Digital Document Management | Administración de documentos digitales.
- 📑 Contract Management | Creación, consulta y seguimiento de contratos.
- ⏳ Probation Period Monitoring | Seguimiento de periodos de prueba.
- 📅 Expiring Contracts Alerts | Control de contratos próximos a vencer.
- 🎓 Education & Training Records | Gestión de estudios y cursos del personal.
- 🏥 Employee Affiliations | Administración de afiliaciones (EPS, AFP, etc.).
- 🔐 Secure Authentication with JWT | Autenticación segura mediante JWT.
- 👥 Role-Based Access Control | Control de acceso por roles (ADMIN, RRHH y USER).
- 📊 Reports and Information Export | Generación de reportes y exportación de información.
- 📝 Audit and Activity Tracking | Registro y seguimiento de cambios realizados en el sistema.

## 🏗️ System Architecture | Arquitectura del Sistema

```text
                    🌐 React + Bootstrap
                  (Frontend - Client)

                           │
                           │ REST API (JSON)
                           ▼

              ☕ Spring Boot 3 + Maven
             (Backend - Business Logic)

                           │
                           │ JPA / Hibernate
                           ▼

                    🗄️ MySQL Database
                  (Persistent Data Storage)

                           │
                           ▼

          🔐 JWT Authentication & Role-Based Security
```
## 📁 Project Structure | Estructura del Proyecto

```text
proyecto-vigitecol/
│
├── backend/
│   ├── src/main/java/
│   │   ├── controller/
│   │   ├── domain/
│   │   ├── infra/
│   │   └── resources/
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── img/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── database/
│   └── Scripts SQL
│
├── docs/
│   └── User Manual.pdf
│
└── README.md
```

## ⚙️ Installation | Instalación

### Prerequisites | Prerrequisitos

- Java 21
- Node.js 20+
- MySQL 8
- Maven 3.9+
- Git

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The backend will be available at:

```text
http://localhost:8080
```

The frontend will be available at:

```text
http://localhost:3000
```

## 🧩 System Modules | Módulos del Sistema

| Module | Descripción |
|---------|-------------|
| 👨‍💼 Employee Management | Registro, consulta, actualización y administración de empleados. |
| 📄 Document Management | Gestión de documentos asociados a cada empleado. |
| 📑 Contract Management | Administración y seguimiento de contratos laborales. |
| ⏳ Probation Period | Control y seguimiento de empleados en período de prueba. |
| 📅 Expiring Contracts | Monitoreo de contratos próximos a vencer. |
| 🎓 Education & Training | Gestión de estudios, cursos y capacitaciones. |
| 🏥 Employee Affiliations | Administración de afiliaciones (EPS, AFP, etc.). |
| 👨‍👩‍👧 Family Information | Registro de información de familiares. |
| 🚗 Vehicle Information | Registro de información de vehículos del empleado. |
| 👥 User Administration | Administración de usuarios, roles y estados. |
| 📊 Reports | Consulta y generación de reportes administrativos. |
| 🔐 Authentication & Security | Inicio de sesión seguro mediante JWT y control de acceso por roles. |

## 🚀 Live Demo | Demostración en Línea

### 🌐 Frontend (Vercel)

🔗 https://proyecto-vigitecol-dsa7.vercel.app/

> Explore the application through its live deployment.
>
> Explora la aplicación mediante su despliegue en línea.

---

### ⚙️ Backend

The backend is currently intended for local development and testing.

El backend está destinado actualmente para desarrollo y pruebas en entorno local.

---

### 📖 User Manual | Manual de Usuario

The complete User Manual is available in the `docs` folder of this repository.

El Manual de Usuario completo se encuentra disponible en la carpeta `docs` de este repositorio.
