import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserResponse, CreateUserRequest } from '../models/user.model';
import { validatePassword, validateName, validateEmail } from '../utils/validation.util';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: UserResponse;
  token: string;
}

let users: User[] = [];

export class AuthService {
  static async register(userData: CreateUserRequest): Promise<UserResponse> {
    // Validar nombre
    const nameValidation = validateName(userData.name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.message);
    }

    // Validar email
    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    // Validar contraseña
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const normalizedEmail = userData.email.trim().toLowerCase();
    const normalizedPassword = userData.password;

    console.log('REGISTER - datos recibidos:', userData);

    const existingUser = users.find(user => user.email === normalizedEmail);
    if (existingUser) {
      console.log('REGISTER - usuario ya existe:', existingUser);
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    const newUser: User = {
      id: uuidv4(),
      name: userData.name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    };

    users.push(newUser);

    console.log('REGISTER - usuarios guardados:', users);

    const { password, ...userResponse } = newUser;
    return userResponse;
  }

  static getAllUsers(): UserResponse[] {
    return users.map(({ password, ...user }) => user);
  }

  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    // Validar email
    const emailValidation = validateEmail(loginData.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    // Validar formato de contraseña (antes de procesar)
    const passwordValidation = validatePassword(loginData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const normalizedEmail = loginData.email.trim().toLowerCase();
    const normalizedPassword = loginData.password;

    console.log('LOGIN - datos recibidos:', loginData);
    console.log('LOGIN - usuarios disponibles:', users);

    const user = users.find(u => u.email === normalizedEmail);
    console.log('LOGIN - usuario encontrado:', user);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(normalizedPassword, user.password);
    console.log('LOGIN - password válido:', isPasswordValid);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    const { password, ...userResponse } = user;

    return {
      message: 'Login successful',
      user: userResponse,
      token
    };
  }
}