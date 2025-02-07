import axios from 'axios';

const API_URL = 'http://103.12.1.132:8192/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/user/register', { name, email, password });
  return response.data;
};
export const getUsers = async (name: string, email: string, password: string) => {
  const response = await api.get('/user/getuser');
  return response.data;
};

export const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (todo: { title: string; description: string }) => {
  const response = await api.post('/todos', todo);
  return response.data;
};

export const updateTodo = async (id: number, todo: { completed?: boolean }) => {
  const response = await api.put(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};