import axios from "axios";
import { Tarea } from "../screens/Tipo";

const api = axios.create({
  baseURL: "https://671195294eca2acdb5f52a81.mockapi.io",
});

// Interceptor para debug
api.interceptors.request.use((config) => {
  console.log("Request:", config.method?.toUpperCase(), config.url);
  return config;
});

export const tareasApi = {
  getAll: () => api.get<Tarea[]>("/tareas"),
  create: (task: string) => api.post<Tarea>("/tareas", { task }),
  update: (id: string, task: string) =>
    api.put<Tarea>(`/tareas/${id}`, { task }),
  remove: (id: string) => api.delete(`/tareas/${id}`),
};