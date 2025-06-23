

// Tipos para o modelo Admin
export interface Admin {
  id: number;
  name: string;
  email: string;
  username: string;
  password?: string; 
  created_at?: Date;
  updated_at?: Date;
}

// Tipo para resposta pública do Admin (sem password)
export interface AdminPublic {
  id: number;
  name: string;
  email: string;
  username: string;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para requests
export interface CreateAdminRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface UpdateAdminRequest {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
}

// Extensão do namespace Express para adminId
declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}