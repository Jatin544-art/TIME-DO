export interface User {
  code: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (code: string) => User | null;
  logout: () => void;
  register: (name: string, email?: string) => { code: string; user: User };
}
