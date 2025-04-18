export type RegisterData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
  
  export type User = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    token?: string;
  };
  
  
  export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (userData: User, redirectCallback?: () => void) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: (redirectCallback?: () => void) => Promise<void>;
    hasRole: (role: string) => boolean;
    isAdmin: () => boolean;
    isAuthenticated: boolean;
    loadUser: () => Promise<void>;
  };