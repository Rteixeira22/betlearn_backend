
// Tipos para o modelo User
export interface User {
  id_user: number;
  username: string;
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para o modelo Admin
export interface Admin {
  id: number;
  username: string;
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para respostas de autenticação
export interface UserWithoutPassword {
  id_user: number;
  username: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AdminWithoutPassword {
  id: number;
  username: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LoginResponse {
  user: UserWithoutPassword;
  token: string;
}

export interface AdminLoginResponse {
  admin: AdminWithoutPassword;
  token: string;
}

// Tipos para requests
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}