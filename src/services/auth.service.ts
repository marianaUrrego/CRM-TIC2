// Tipos para la autenticación
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export interface ApiError {
  message: string;
}

// URL base del backend
const API_URL = "http://localhost:5000/api/auth";

// Servicio de autenticación
export class AuthService {
  // Registrar usuario
  static async registerUser(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Iniciar sesión
  static async loginUser(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Guardar datos en localStorage
  static saveAuthData(token: string, user: User): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // Obtener datos del localStorage
  static getAuthData(): { token: string | null, user: User | null } {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    return {
      token,
      user: userData ? JSON.parse(userData) : null
    };
  }

  // Limpiar localStorage (logout)
  static clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
}
