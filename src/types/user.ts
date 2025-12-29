export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}
