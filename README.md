# Orbit - CRM Cloud Migration MVP

Orbit es una aplicación CRM desarrollada como proyecto académico de TIC2, enfocada en la migración de una solución web hacia una arquitectura en la nube usando servicios de AWS.

El sistema permite la autenticación de usuarios, la gestión de clientes y la visualización de información básica mediante un dashboard conectado a una base de datos PostgreSQL en la nube.

## Arquitectura general

Orbit está diseñado bajo una arquitectura desacoplada, separando la capa de presentación, la capa de API, la lógica de negocio y la persistencia de datos.

```text
Usuario
  ↓
Frontend en AWS Amplify Hosting
  ↓
Amazon API Gateway
  ↓
Backend en AWS Elastic Beanstalk
  ↓
Base de datos en Amazon RDS PostgreSQL
```

Esta arquitectura permite que cada componente del sistema pueda administrarse, desplegarse y escalarse de forma independiente.

## Objetivo del proyecto

El objetivo del proyecto es implementar un CRM básico desplegado en la nube, aplicando buenas prácticas de separación por capas, modularidad, autenticación segura y persistencia administrada.

El proyecto busca demostrar:

- Migración de una aplicación web hacia AWS.
- Separación entre frontend, backend y base de datos.
- Consumo de una API REST desde una aplicación web.
- Autenticación basada en JWT.
- Persistencia de datos en PostgreSQL administrado.
- Despliegue de servicios cloud para frontend, backend y base de datos.
- Comunicación segura desde el frontend mediante HTTPS.

## Servicios cloud utilizados

### AWS Amplify Hosting

Servicio utilizado para desplegar el frontend de Orbit.

Amplify Hosting permite publicar la aplicación React como sitio web estático, exponiéndola mediante HTTPS y facilitando actualizaciones mediante despliegues del build de producción.

### Amazon API Gateway

Servicio utilizado como capa de entrada HTTPS para la API.

API Gateway recibe las peticiones realizadas desde el frontend y las redirige hacia el backend desplegado en Elastic Beanstalk. Esta capa permite evitar problemas de seguridad del navegador relacionados con Mixed Content.

### AWS Elastic Beanstalk

Servicio utilizado para desplegar y administrar el backend.

Elastic Beanstalk ejecuta la API REST desarrollada con Node.js, Express y TypeScript, administrando la infraestructura necesaria para mantener el backend disponible.

### Amazon RDS PostgreSQL

Servicio utilizado para alojar la base de datos relacional.

Amazon RDS permite administrar PostgreSQL en la nube sin depender de una base de datos local o temporal. En esta base se almacenan usuarios, clientes e historial de cambios de estado.

### Amazon EC2

Elastic Beanstalk utiliza instancias EC2 para ejecutar el backend de la aplicación.

### Security Groups

Se utilizan Security Groups para controlar el acceso entre los servicios cloud, especialmente entre el backend y la base de datos RDS.

## Stack tecnológico

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- SCSS
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

### Base de datos

- PostgreSQL
- Amazon RDS PostgreSQL

### Cloud

- AWS Amplify Hosting
- Amazon API Gateway
- AWS Elastic Beanstalk
- Amazon RDS
- Amazon EC2
- Security Groups

## Funcionalidades principales

### Autenticación

- Registro de usuarios.
- Inicio de sesión.
- Generación de token JWT.
- Protección de rutas privadas.
- Validación de credenciales.
- Hash de contraseñas con bcryptjs.
- Persistencia de usuarios en PostgreSQL.

### Gestión de clientes

- Crear clientes.
- Listar clientes.
- Editar clientes.
- Cambiar estado de clientes.
- Eliminar clientes.
- Buscar clientes por nombre, correo o empresa.
- Ver detalles de clientes.
- Paginación de registros.
- Persistencia de clientes en PostgreSQL.

### Dashboard

- Visualización general de información del CRM.
- Métricas básicas de clientes.
- Distribución de clientes por estado.
- Información obtenida desde la base de datos en la nube.

## Estructura del proyecto

```text
Orbit/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── EditProfileModal.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── Customers.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── styles/
│   │   └── router.tsx
│   ├── features/
│   │   └── customers/
│   │       ├── components/
│   │       │   ├── CustomerActionsMenu.tsx
│   │       │   ├── CustomerDetailsModal.tsx
│   │       │   ├── CustomerFormModal.tsx
│   │       │   ├── CustomerPagination.tsx
│   │       │   ├── CustomerStatusBadge.tsx
│   │       │   └── CustomerTable.tsx
│   │       ├── hooks/
│   │       │   ├── useCustomers.ts
│   │       │   └── useCustomerTable.ts
│   │       ├── customer.constants.ts
│   │       ├── customer.types.ts
│   │       └── customer.validation.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── customer.service.ts
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── customer.controller.ts
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── customer.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── customer.service.ts
│   │   └── utils/
│   │       └── validation.util.ts
│   ├── package.json
│   └── tsconfig.json
├── public/
│   └── crm-analytics-logo.svg
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Diseño modular del frontend

El frontend fue organizado para separar responsabilidades y facilitar el mantenimiento.

### Páginas principales

- `Login.tsx`: página de inicio de sesión.
- `Register.tsx`: página de registro.
- `Dashboard.tsx`: página principal de métricas.
- `Customers.tsx`: página de gestión de clientes.

### Servicios

Los servicios centralizan la comunicación con la API.

- `api.ts`: configuración de la URL base de la API.
- `auth.service.ts`: peticiones relacionadas con autenticación.
- `customer.service.ts`: peticiones relacionadas con clientes.

### Módulo de clientes

La funcionalidad de clientes fue separada en componentes, hooks, tipos, constantes y validaciones.

Componentes principales:

- `CustomerTable`
- `CustomerActionsMenu`
- `CustomerFormModal`
- `CustomerDetailsModal`
- `CustomerPagination`
- `CustomerStatusBadge`

Hooks principales:

- `useCustomers`
- `useCustomerTable`

Archivos de soporte:

- `customer.types.ts`
- `customer.constants.ts`
- `customer.validation.ts`

## Diseño modular del backend

El backend sigue una estructura por capas para separar responsabilidades.

### Capas principales

- `routes`: define los endpoints de la API.
- `controllers`: recibe y responde peticiones HTTP.
- `services`: contiene la lógica de negocio.
- `models`: representa las entidades principales.
- `middlewares`: maneja autenticación y validaciones intermedias.
- `config`: centraliza configuraciones como la conexión a base de datos.
- `utils`: contiene funciones auxiliares y validaciones.

## Base de datos

Orbit utiliza PostgreSQL administrado en Amazon RDS.

### Tablas principales

```text
users
customers
customer_status_history
```

### users

Tabla encargada de almacenar la información de los usuarios registrados.

Campos principales:

```text
id
full_name
email
password_hash
created_at
updated_at
```

### customers

Tabla encargada de almacenar la información de los clientes.

Campos principales:

```text
id
owner_user_id
full_name
email
phone_number
company
status
country
address
created_at
updated_at
```

### customer_status_history

Tabla encargada de almacenar el historial de cambios de estado de los clientes.

Campos principales:

```text
id
customer_id
changed_by_user_id
previous_status
new_status
changed_at
```

## API REST

La API de Orbit está expuesta mediante Amazon API Gateway y es atendida por el backend desplegado en AWS Elastic Beanstalk.

### Autenticación

```text
POST /api/auth/register
POST /api/auth/login
```

### Clientes

```text
GET /api/customers
POST /api/customers
PUT /api/customers/:id
PATCH /api/customers/:id/status
DELETE /api/customers/:id
```

## Seguridad

Orbit implementa las siguientes medidas de seguridad:

- Autenticación mediante JWT.
- Hash de contraseñas con bcryptjs.
- Protección de rutas privadas.
- Middleware de autenticación en el backend.
- Variables sensibles fuera del código fuente.
- Base de datos alojada en Amazon RDS.
- Acceso a la base de datos controlado mediante Security Groups.
- API expuesta mediante HTTPS usando Amazon API Gateway.
- Frontend publicado mediante HTTPS usando AWS Amplify Hosting.
- Separación entre credenciales de base de datos y secreto JWT.

## Variables de entorno

Las variables sensibles no se almacenan en el repositorio.

En producción, las variables del frontend y del backend se configuran en los servicios cloud correspondientes.

### Frontend

El frontend utiliza una variable de entorno para definir la URL base de la API expuesta mediante API Gateway.

### Backend

El backend utiliza variables de entorno para definir:

- Puerto de ejecución.
- URL de conexión a la base de datos.
- Secreto para firmar tokens JWT.
- Entorno de ejecución.

No se deben subir al repositorio archivos `.env` con credenciales reales.

## Despliegue

### Despliegue del frontend

El frontend se despliega en AWS Amplify Hosting.

Proceso general:

```text
1. Configurar la URL de API Gateway en las variables de entorno del frontend.
2. Generar el build de producción con Vite.
3. Comprimir el contenido generado en la carpeta dist.
4. Subir el paquete a Amplify Hosting.
5. Verificar que la aplicación cargue correctamente desde la URL pública.
```

El paquete de despliegue debe contener directamente los archivos generados por Vite, por ejemplo:

```text
index.html
assets/
```

No debe comprimirse una carpeta contenedora adicional.

### Despliegue del backend

El backend se despliega en AWS Elastic Beanstalk.

Proceso general:

```text
1. Preparar el backend para producción.
2. Generar el paquete de despliegue del backend.
3. Excluir archivos innecesarios o sensibles.
4. Subir el paquete al entorno de Elastic Beanstalk.
5. Configurar las variables de entorno en AWS.
6. Verificar el estado del entorno.
7. Probar los endpoints de la API.
```

No se deben incluir en el paquete de despliegue:

```text
node_modules/
.env
```

### Despliegue de la base de datos

La base de datos se aloja en Amazon RDS PostgreSQL.

Proceso general:

```text
1. Crear una instancia RDS con motor PostgreSQL.
2. Configurar red, puerto y Security Groups.
3. Crear la base de datos del proyecto.
4. Ejecutar el script SQL de creación de tablas.
5. Conectar el backend a la base de datos mediante variables de entorno.
```

## Flujo de comunicación

### Inicio de sesión

```text
Usuario ingresa credenciales
  ↓
Frontend en Amplify envía la petición
  ↓
API Gateway recibe la solicitud HTTPS
  ↓
Elastic Beanstalk procesa la autenticación
  ↓
RDS valida los datos del usuario
  ↓
Backend retorna token JWT
  ↓
Frontend almacena la sesión
```

### Gestión de clientes

```text
Usuario realiza acción sobre clientes
  ↓
Frontend envía la petición con token JWT
  ↓
API Gateway redirige la petición
  ↓
Backend valida el token
  ↓
Backend ejecuta la operación en RDS
  ↓
Frontend actualiza la interfaz
```

## Buenas prácticas aplicadas

### Frontend

- Separación de servicios API.
- Uso de componentes reutilizables.
- Extracción de lógica de clientes en hooks.
- Separación de constantes, tipos y validaciones.
- Componentes específicos para tabla, paginación, modales y estados.
- Uso de variables de entorno para configurar la API.
- Diseño responsivo con SCSS.

### Backend

- Separación por capas.
- Controladores para manejar peticiones HTTP.
- Servicios para lógica de negocio.
- Middlewares para autenticación.
- Configuración centralizada de base de datos.
- Manejo de errores.
- Validaciones de entrada.
- Variables sensibles gestionadas fuera del código.

### Cloud

- Frontend, backend y base de datos separados.
- Frontend desplegado como sitio estático administrado.
- Backend desplegado como servicio web administrado.
- Base de datos administrada en Amazon RDS.
- API Gateway como capa HTTPS.
- Control de acceso mediante Security Groups.
- Despliegue modular por servicios.

## Validaciones

### Usuario

- Nombre obligatorio.
- Nombre con letras y espacios.
- Correo obligatorio.
- Correo con formato válido.
- Contraseña obligatoria.
- Contraseña con reglas mínimas de seguridad.
- Correo único por usuario.

### Contraseña

La contraseña debe cumplir:

- Mínimo 8 caracteres.
- Al menos una letra mayúscula.
- Al menos una letra minúscula.
- Al menos un número.
- Al menos un carácter especial.

### Cliente

- Nombre obligatorio.
- Email obligatorio y válido.
- Teléfono obligatorio y numérico.
- Empresa obligatoria.
- País obligatorio.
- Dirección obligatoria.
- Estado permitido: active, pending o inactive.

## Estado actual del proyecto

Orbit cuenta con:

- Frontend desplegado en AWS Amplify Hosting.
- Backend desplegado en AWS Elastic Beanstalk.
- API expuesta mediante Amazon API Gateway.
- Base de datos PostgreSQL administrada en Amazon RDS.
- Autenticación JWT funcional.
- CRUD de clientes funcional.
- Dashboard conectado a datos reales.
- Arquitectura cloud separada por capas.

## Autores

Proyecto desarrollado para el curso TIC2.

Integrantes:

- Sebastián Villa
- Steve Ellis
- Natalia Urrego
- Mariana Urrego
- Juanita Correa

## Licencia

ISC