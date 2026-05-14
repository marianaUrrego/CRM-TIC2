# CRM-TIC2

Aplicación CRM desarrollada como proyecto académico de TIC2.  
El sistema está dividido en:

- **Frontend:** React + TypeScript + Vite + SCSS
- **Backend:** Node.js + Express + TypeScript
- **Autenticación:** Sistema completo de registro y login con validaciones de seguridad
- **Gestión de Clientes:** CRUD completo de clientes

## Objetivo del proyecto

Este proyecto busca centralizar la gestión de usuarios y operaciones relacionadas con un CRM básico, con una arquitectura separada entre frontend y backend.

## Funcionalidades actuales

### Autenticación
- Registro de usuarios con validaciones de seguridad
- Login con token JWT
- Dashboard protegido
- Validaciones de contraseña (8+ caracteres, mayúscula, minúscula, número, especial)
- Validaciones de nombre (solo letras y espacios)
- Hash de contraseñas con `bcryptjs`

### Gestión de Clientes
- Crear clientes
- Listar clientes
- Editar clientes
- Eliminar clientes
- Búsqueda de clientes

### Frontend
- Navegación con React Router
- Componentes UI reutilizables
- Modales para edición
- Header con navegación
- Diseño responsivo con SCSS

### Backend
- Arquitectura MVC (Model-View-Controller)
- Validaciones de entrada
- Middleware de autenticación
- Manejo de errores
- CORS configurado

## Stack tecnológico

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- SCSS
- Lucide React (iconos)

### Backend
- Node.js
- Express
- TypeScript
- CORS
- dotenv
- bcryptjs
- jsonwebtoken
- uuid
- pg (PostgreSQL)

## Estructura del proyecto

```text
CRM-TIC2/
├── src/                          # Frontend
│   ├── app/
│   │   ├── components/           # Componentes React
│   │   │   ├── EditProfileModal.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ui/               # Componentes UI base
│   │   ├── pages/                # Páginas de la aplicación
│   │   │   ├── Customers.tsx     # Gestión de clientes
│   │   │   ├── Dashboard.tsx     # Dashboard principal
│   │   │   ├── Login.tsx         # Página de login
│   │   │   └── Register.tsx      # Página de registro
│   │   ├── styles/               # Estilos SCSS
│   │   └── router.tsx            # Configuración de rutas
│   ├── services/                  # Servicios del frontend
│   │   ├── api.ts                # Configuración de API
│   │   ├── auth.service.ts       # Servicio de autenticación
│   │   └── customer.service.ts   # Servicio de clientes
│   ├── assets/                   # Assets estáticos
│   ├── App.tsx                   # Componente principal
│   └── main.tsx                  # Punto de entrada
├── backend/                      # Backend
│   ├── src/
│   │   ├── app.ts                # Configuración de Express
│   │   ├── server.ts             # Servidor principal
│   │   ├── config/               # Configuraciones
│   │   ├── controllers/          # Controladores
│   │   │   ├── auth.controller.ts
│   │   │   └── customer.controller.ts
│   │   ├── middlewares/          # Middlewares
│   │   ├── models/               # Modelos de datos
│   │   ├── routes/              # Rutas de la API
│   │   │   ├── auth.routes.ts
│   │   │   └── customer.routes.ts
│   │   ├── services/            # Lógica de negocio
│   │   │   ├── auth.service.ts
│   │   │   └── customer.service.ts
│   │   └── utils/               # Utilidades
│   │       └── validation.util.ts
│   ├── .env                     # Variables de entorno
│   ├── package.json
│   └── tsconfig.json
├── public/                      # Archivos públicos
│   └── crm-analytics-logo.svg
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Instalación

### Requisitos previos
- Node.js (v18 o superior)
- npm o yarn
- PostgreSQL (para producción)

### Instalación del proyecto

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd CRM-TIC2

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
```

## Configuración

### Backend

Crear archivo `.env` en la carpeta `backend/`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_tic2
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret
```

## Ejecución

### Desarrollo

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Producción

```bash
# Build del frontend
npm run build

# Build del backend
cd backend
npm run build

# Iniciar backend
npm start
```

## API Endpoints

### Autenticación

#### POST /api/auth/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

#### POST /api/auth/login
Inicia sesión de usuario.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "jwt_token"
}
```

### Clientes

#### GET /api/customers
Obtiene todos los clientes.

#### POST /api/customers
Crea un nuevo cliente.

#### PUT /api/customers/:id
Actualiza un cliente existente.

#### DELETE /api/customers/:id
Elimina un cliente.

## Validaciones de Seguridad

### Contraseña
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial (!@#$%^&* etc.)

### Nombre
- Solo permite letras y espacios
- Acepta acentos (á, é, í, ó, ú)
- Acepta ñ y Ñ

## Scripts disponibles

### Frontend
```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Previsualiza el build de producción
```

### Backend
```bash
npm run dev          # Inicia servidor en modo desarrollo
npm run build        # Compila TypeScript
npm start            # Inicia servidor en producción
```

## Tecnologías utilizadas

- **Frontend:** React, TypeScript, Vite, SCSS, React Router
- **Backend:** Node.js, Express, TypeScript
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT, bcryptjs
- **Validaciones:** Regex personalizados
- **Estilos:** SCSS con módulos

## Autores

Proyecto desarrollado para el curso TIC2.

## Licencia

ISC
