export interface User {
  UserID: number;
  Name: string;
  Email: string;
  UserRole: string;
  CreatedAt: string;
  token: string;
}

export interface Todo {
  TodoID: number;
  Title: string;
  Description: string;
  Completed: boolean;
  UserID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}