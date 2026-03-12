# CRM Backend - Auth Module

Backend para el sistema CRM con funcionalidad de registro de usuarios.

## Estructura del Proyecto

```
src/
├── controllers/
│   └── auth.controller.ts    # Controladores de autenticación
├── routes/
│   └── auth.routes.ts        # Rutas de autenticación
├── services/
│   └── auth.service.ts       # Lógica de negocio de autenticación
├── models/
│   └── user.model.ts         # Interfaces y tipos de usuario
├── app.ts                    # Configuración de Express
└── server.ts                 # Servidor principal
```

## Instalación

```bash
npm install
```

## Ejecución

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm run build
npm start
```

## API Endpoints

### POST /api/auth/register

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response Exitoso (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string"
  }
}
```

**Response de Error (400):**
```json
{
  "message": "Error description"
}
```

## Validaciones

- Todos los campos son obligatorios
- Email debe tener formato válido
- Password debe tener mínimo 6 caracteres
- No permite emails duplicados

## Pruebas con Postman

1. **Configurar Postman:**
   - Método: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Headers: `Content-Type: application/json`

2. **Body (raw JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

3. **Ejemplos de prueba:**

   **Registro exitoso:**
   ```json
   {
     "name": "Ana García",
     "email": "ana@example.com", 
     "password": "password123"
   }
   ```

   **Email inválido:**
   ```json
   {
     "name": "Test",
     "email": "email-invalido",
     "password": "123456"
   }
   ```

   **Password muy corto:**
   ```json
   {
     "name": "Test",
     "email": "test@example.com",
     "password": "123"
   }
   ```

   **Email duplicado:**
   ```json
   {
     "name": "Otro Usuario",
     "email": "ana@example.com",
     "password": "password456"
   }
   ```

## Características

- ✅ TypeScript con tipos e interfaces
- ✅ Almacenamiento temporal en memoria
- ✅ Hash de contraseñas con bcryptjs
- ✅ Validaciones de entrada
- ✅ CORS habilitado
- ✅ Manejo de errores
- ✅ IDs únicos con UUID

## Notas

- Los datos se almacenan en memoria y se pierden al reiniciar el servidor
- No se implementa login todavía (solo registro)
- La contraseña nunca se devuelve en la respuesta
