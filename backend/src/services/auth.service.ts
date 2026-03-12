import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db';
import { UserResponse, CreateUserRequest } from '../models/user.model';
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

export class AuthService {
  static async register(userData: CreateUserRequest): Promise<UserResponse> {
    const nameValidation = validateName(userData.name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.message);
    }

    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const normalizedEmail = userData.email.trim().toLowerCase();
    const normalizedName = userData.name.trim();

    const existingUserResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existingUserResult.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userId = uuidv4();

    const insertResult = await pool.query(
      `
      INSERT INTO users (id, full_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email
      `,
      [userId, normalizedName, normalizedEmail, hashedPassword]
    );

    const createdUser = insertResult.rows[0];

    return {
      id: createdUser.id,
      name: createdUser.full_name,
      email: createdUser.email,
    };
  }

  static async getAllUsers(): Promise<UserResponse[]> {
    const result = await pool.query(
      `
      SELECT id, full_name, email
      FROM users
      ORDER BY created_at DESC
      `
    );

    return result.rows.map((user) => ({
      id: user.id,
      name: user.full_name,
      email: user.email,
    }));
  }

  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    const emailValidation = validateEmail(loginData.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.message);
    }

    if (!loginData.password || loginData.password.trim() === '') {
      throw new Error('Password is required');
    }

    const normalizedEmail = loginData.email.trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT id, full_name, email, password_hash
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: '1d' }
    );

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
      },
      token,
    };
  }
}