export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}