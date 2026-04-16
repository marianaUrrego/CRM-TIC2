# CRM-TIC2

Aplicación CRM desarrollada como proyecto académico de TIC2.  
El sistema está dividido en:

- **Frontend:** React + TypeScript + Vite + SCSS
- **Backend:** Node.js + Express + TypeScript
- **Persistencia:** actualmente en memoria / preparación para PostgreSQL
- **Autenticación:** módulo de registro de usuarios

## Objetivo del proyecto

Este proyecto busca centralizar la gestión de usuarios y operaciones relacionadas con un CRM básico, con una arquitectura separada entre frontend y backend.

## Funcionalidades actuales

- Registro de usuarios
- Login y navegación entre vistas
- Dashboard básico
- Backend con módulo de autenticación
- Validaciones de entrada en el backend
- Hash de contraseñas con `bcryptjs`
- Uso de TypeScript en frontend y backend

## Stack tecnológico

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- SCSS
- Material UI
- Emotion
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- CORS
- dotenv
- bcryptjs
- jsonwebtoken
- uuid
- pg

## Estructura general del proyecto

```text
CRM-TIC2/
├── src/                  # Frontend
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── router.tsx
│   ├── App.tsx
│   └── main.tsx
├── backend/              # Backend
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── public/
└── README.md
