import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserRequest } from '../models/user.model';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      const user = await AuthService.register(userData);
      
      res.status(201).json({
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({
        message: errorMessage
      });
    }
  }
}
