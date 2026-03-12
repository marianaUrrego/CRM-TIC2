import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserResponse, CreateUserRequest } from '../models/user.model';

// Almacenamiento temporal en memoria
let users: User[] = [];

export class AuthService {
  static async register(userData: CreateUserRequest): Promise<UserResponse> {
    // Validaciones básicas
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('All fields are required');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validar longitud de contraseña
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear nuevo usuario
    const newUser: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword
    };

    // Guardar usuario en memoria
    users.push(newUser);

    // Devolver usuario sin contraseña
    const { password, ...userResponse } = newUser;
    return userResponse;
  }

  // Método auxiliar para obtener todos los usuarios (solo para desarrollo)
  static getAllUsers(): UserResponse[] {
    return users.map(({ password, ...user }) => user);
  }
}
