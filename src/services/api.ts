import axios from 'axios';
import { Employee } from '../types/employee';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL.replace('/employees', ''),
});

export const employeeApi = {
  getAll: () => api.get<Employee[]>('/employees'),
  getById: (id: number) => api.get<Employee>(`/employees/${id}`),
  create: (employee: Employee) => api.post<Employee>('/employees', employee),
  update: (id: number, employee: Employee) => api.put<Employee>(`/employees/${id}`, employee),
  delete: (id: number) => api.delete<{ deleted: boolean }>(`/employees/${id}`),
};