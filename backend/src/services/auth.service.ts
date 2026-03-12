import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserResponse, CreateUserRequest } from '../models/user.model';

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
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('All fields are required');
    }

    const normalizedEmail = userData.email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    console.log('REGISTER - datos recibidos:', userData);

    const existingUser = users.find(user => user.email === normalizedEmail);
    if (existingUser) {
      console.log('REGISTER - usuario ya existe:', existingUser);
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

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
    if (!loginData.email || !loginData.password) {
      throw new Error('Email and password are required');
    }

    const normalizedEmail = loginData.email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }

    console.log('LOGIN - datos recibidos:', loginData);
    console.log('LOGIN - usuarios disponibles:', users);

    const user = users.find(u => u.email === normalizedEmail);
    console.log('LOGIN - usuario encontrado:', user);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
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